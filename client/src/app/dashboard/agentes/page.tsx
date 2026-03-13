'use client'
import { useState, useEffect } from 'react'
import { useProtectedPage } from '@/hooks/useProtectedPage'
import { useAuth } from '@/contexts/AuthContext'
import styles from './style.module.css'
import Image from 'next/image'
import Sidebar from '../../../components/Sidebar/Sidebar'
import Agent from '@/components/Agent/Agent'

type Area = {
  id: string
  area_name: string
}

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

  const [areas, setAreas] = useState<Area[]>([])
  const [selectedAreaId, setSelectedAreaId] = useState('')

  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contractStart, setContractStart] = useState('')
  const [contractEnd, setContractEnd] = useState('')

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

  useEffect(() => {
    fetch('http://localhost:5000/areas/get')
      .then((res) => res.json())
      .then((json) => {
        const list = (json?.data || []) as Area[]
        setAreas(list)

        if (list.length > 0) setSelectedAreaId(list[0].id)
      })
      .catch((err) => console.error('Erro ao buscar áreas:', err))
  }, [])

  const loadAgents = async () => {
    if (!user?.institute_id) return

    try {
      const res = await fetch(
        `http://localhost:5000/agents/get?institute_id=${user.institute_id}`
      )
      const json = await res.json()
      const agentsList: AgentType[] = json.data || []

      const agentsWithStatus = await Promise.all(
        agentsList.map(async (agent) => {
          try {
            const linkedRes = await fetch(
              `http://localhost:5000/agentSectors/get?agent_id=${agent.id}`
            )

            if (!linkedRes.ok) {
              return { ...agent, allExpired: false }
            }

            const linkedJson = await linkedRes.json()
            const firstAgent = linkedJson?.data?.[0]
            const sectors = Array.isArray(firstAgent?.sectors) ? firstAgent.sectors : []

            const hasAnySector = sectors.length > 0
            const allExpired =
              hasAnySector && sectors.every((sector: any) => isExpired(sector.contract_end))

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

  const resetForm = () => {
    setFirstName('')
    setSurname('')
    setEmail('')
    setPassword('')
    setContractStart('')
    setContractEnd('')
    if (areas.length > 0) setSelectedAreaId(areas[0].id)
    else setSelectedAreaId('')
  }

  const isExpired = (contractEnd?: string | null) => {
    if (!contractEnd) return false

    const onlyDate = contractEnd.split('T')[0]

    const today = new Date()
    const todayString = today.toISOString().split('T')[0]

    return onlyDate < todayString
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return
    }

    if (!selectedAreaId) {
      alert('Selecione uma área.')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/agents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          surname,
          email,
          password,
          area: { id: selectedAreaId },
          contract_start: null,
          contract_end: null,
          // contract_start: contractStart || null,
          // contract_end: contractEnd || null,
        }),
      })

      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch { }

      if (!res.ok) {
        alert(data?.message || data?.error || 'Erro ao criar monitor')
        return
      }

      await loadAgents()
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      console.error(err)
      alert('Erro ao criar monitor')
    }
  }

  if (checking) return <div>Carregando...</div>

  return (
    <main className={styles.main}>
      <Sidebar />

      <section className={styles.mainContent}>
        <article className={styles.mainHeader}>
          <button
            className={styles.newAgent}
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              className={styles.plus}
              src="/plus.svg"
              alt="Plus"
              width={24}
              height={24}
            />
            <h2>Novo monitor</h2>
          </button>
          
          <h2 className={styles.title}>Monitores</h2>

          <input
            type="text"
            placeholder="Pesquisar monitor pelo nome"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </article>

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

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTittle}>Novo Monitor</h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Nome"
                  className={styles.inputs}
                />

                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  placeholder="Sobrenome"
                  className={styles.inputs}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className={styles.inputs}
                />

                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Senha"
                  className={styles.inputs}
                />
                {/* 
                <input
                  type="date"
                  value={contractStart}
                  onChange={(e) => setContractStart(e.target.value)}
                  className={styles.inputs}
                />

                <input
                  type="date"
                  value={contractEnd}
                  onChange={(e) => setContractEnd(e.target.value)}
                  className={styles.inputs}
                /> */}

                <select
                  value={selectedAreaId}
                  onChange={(e) => setSelectedAreaId(e.target.value)}
                  required
                  className={`${styles.select} ${styles.inputs}`}
                >
                  {areas.length === 0 ? (
                    <option value="">Carregando áreas...</option>
                  ) : (
                    areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.area_name}
                      </option>
                    ))
                  )}
                </select>

                <div className={styles.modalActions}>
                  <button
                    className={`${styles.modalCancel} ${styles.modalActionsButton}`}
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      resetForm()
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    className={`${styles.modalCreate} ${styles.modalActionsButton}`}
                    type="submit"
                  >
                    Criar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}