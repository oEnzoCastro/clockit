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
      setAgents(json.data || [])
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
          contract_start: contractStart || null,
          contract_end: contractEnd || null,
        }),
      })

      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch {}

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
            className={styles.newSector}
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
        </article>

        <article className={styles.agentes}>
          {agents.map((a) => (
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
          ))}
        </article>
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