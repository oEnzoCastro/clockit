'use client'
import { useState, useEffect } from 'react'
import { useProtectedPage } from '@/hooks/useProtectedPage'
import { useAuth } from '@/contexts/AuthContext'
import styles from './style.module.css'
import Image from 'next/image'
import Sidebar from '../../../components/Sidebar/Sidebar'
import Agent from '@/components/Agent/Agent'
import NewAgentModal from '@/components/NewAgentModal/NewAgentModal'

type AgentType = {
  id: string
  first_name: string
  surname: string
  email: string
  institute_id: string
  institute_role: string
  contract_start?: string | null
  contract_end?: string | null
  allExpired?: boolean
  area?: { id: string; name?: string; acronym?: string } | null
}

export default function Page() {
  const { checking } = useProtectedPage(['manager'])
  const { accessToken, user } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [agents, setAgents] = useState<AgentType[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const activeAgents = agents.filter((agent) => !agent.allExpired)
  const expiredAgents = agents.filter((agent) => agent.allExpired)

  const matchesSearch = (agent: AgentType) => {
    const fullName = `${agent.first_name} ${agent.surname}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  }

  const filteredActiveAgents = activeAgents.filter(matchesSearch)
  const filteredExpiredAgents = expiredAgents.filter(matchesSearch)

  useEffect(() => {
    loadAgents()
  }, [user?.institute_id])

  const loadAgents = async () => {
    if (!user?.institute_id) return
    try {
      const res = await fetch(`http://localhost:5000/agents/get?institute_id=${user.institute_id}`)
      const json = await res.json()
      const agentsList: AgentType[] = json.data || []

      const agentsWithStatus = await Promise.all(
        agentsList.map(async (agent) => {
          try {
            const linkedRes = await fetch(`http://localhost:5000/agentSectors/get?agent_id=${agent.id}`)
            if (!linkedRes.ok) return { ...agent, allExpired: false }

            const linkedJson = await linkedRes.json()
            const firstAgent = linkedJson?.data?.[0]
            const sectors = Array.isArray(firstAgent?.sectors) ? firstAgent.sectors : []

            const hasAnySector = sectors.length > 0
            const allExpired = hasAnySector && sectors.every((sector: any) => isExpired(sector.contract_end))

            return { ...agent, allExpired }
          } catch {
            return { ...agent, allExpired: false }
          }
        })
      )
      setAgents(agentsWithStatus)
    } catch (err) {
      console.error('Erro ao buscar agentes:', err)
    }
  }

  const isExpired = (contractEnd?: string | null) => {
    if (!contractEnd) return false
    const onlyDate = contractEnd.split('T')[0]
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    return onlyDate < todayString
  }

  if (checking) return <div>Carregando...</div>

  return (
    <main className={styles.main}>
      <Sidebar />

      <section className={styles.mainContent}>
        <header className={styles.mainHeader}>
          <button
            className={styles.newAgent}
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              className={styles.plus}
              src="/plus.svg"
              alt=""
              width={20}
              height={20}
            />
            <span className={styles.newAgentLabel}>Novo monitor</span>
          </button>
          
          <h1 className={styles.title}>Monitores</h1>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Pesquisar monitor pelo nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </header>

        <section className={styles.agentsSections}>
          <article className={styles.agentsArticle}>
            <h2 className={styles.sectionTitle}>Monitores ativos</h2>
            <div className={styles.agents}>
              {filteredActiveAgents.length === 0 ? (
                <p className={styles.noFound}>Nenhum monitor ativo encontrado.</p>
              ) : (
                filteredActiveAgents.map((a) => (
                  <Agent
                    key={a.id}
                    id={a.id}
                    first_name={a.first_name}
                    surname={a.surname}
                    email={a.email}
                    area={a.area}
                    onDeleted={loadAgents}
                    onUpdated={loadAgents}
                  />
                ))
              )}
            </div>
          </article>

          <article className={styles.agentsArticle}>
            <h2 className={styles.sectionTitle}>Monitores com contrato expirado</h2>
            <div className={styles.agents}>
              {filteredExpiredAgents.length === 0 ? (
                <p className={styles.noFound}>Nenhum monitor com contrato expirado encontrado.</p>
              ) : (
                filteredExpiredAgents.map((a) => (
                  <Agent
                    key={a.id}
                    id={a.id}
                    first_name={a.first_name}
                    surname={a.surname}
                    email={a.email}
                    area={a.area}
                    onDeleted={loadAgents}
                    onUpdated={loadAgents}
                  />
                ))
              )}
            </div>
          </article>
        </section>
      </section>

      <NewAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accessToken={accessToken}
        instituteId={user?.institute_id}
        onAgentCreated={loadAgents}
      />
    </main>
  )
}