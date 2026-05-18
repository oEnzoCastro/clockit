'use client'
import { useState, useEffect } from 'react'
import styles from './style.module.css'

type Area = {
  id: string
  area_name: string
}

type NewAgentModalProps = {
  isOpen: boolean
  onClose: () => void
  accessToken: string | null
  instituteId: string | undefined
  onAgentCreated: () => void
}

export default function NewAgentModal({
  isOpen,
  onClose,
  accessToken,
  instituteId,
  onAgentCreated
}: NewAgentModalProps) {
  const [areas, setAreas] = useState<Area[]>([])
  const [selectedAreaId, setSelectedAreaId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

  const resetForm = () => {
    setFirstName('')
    setSurname('')
    setEmail('')
    setPassword('')
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
          contract_start: null,
          contract_end: null,
        }),
      })

      const text = await res.text()
      let data: any = null
      try { data = JSON.parse(text) } catch { }

      if (!res.ok) {
        alert(data?.message || data?.error || 'Erro ao criar monitor')
        return
      }

      onAgentCreated()
      onClose()
      resetForm()
    } catch (err) {
      console.error(err)
      alert('Erro ao criar monitor')
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Novo Monitor</h2>

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
                  onClose()
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
  )
}