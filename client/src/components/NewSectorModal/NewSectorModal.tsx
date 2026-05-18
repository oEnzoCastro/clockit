'use client'
import { useState } from 'react'
import styles from './style.module.css'

type NewSectorModalProps = {
  isOpen: boolean
  onClose: () => void
  accessToken: string | null
  areaId: string
  onSectorCreated: (newSector: any) => void
}

export default function NewSectorModal({
  isOpen,
  onClose,
  accessToken,
  areaId,
  onSectorCreated,
}: NewSectorModalProps) {
  const [sectorName, setSectorName] = useState('')
  const [acronym, setAcronym] = useState('')
  const [isHidden, setIsHidden] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/sectors/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sector_name: sectorName,
          acronym: acronym,
          area_id: areaId,
          is_hidden: isHidden,
        }),
      })

      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch { }

      if (!res.ok) {
        alert(data?.message || data?.error || 'Erro ao criar matéria')
        return
      }

      onSectorCreated(data.data)
      setSectorName('')
      setAcronym('')
      setIsHidden(false)
      onClose()
    } catch (err) {
      console.error(err)
      alert('Erro ao criar matéria')
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Nova Matéria</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              className={styles.inputs}
              type="text"
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
              required
              placeholder="Nome da matéria"
            />

            <input
              className={styles.inputs}
              type="text"
              maxLength={10}
              value={acronym}
              onChange={(e) => setAcronym(e.target.value)}
              required
              placeholder="Sigla"
            />

            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="hidden"
                checked={isHidden}
                onChange={(e) => setIsHidden(e.target.checked)}
              />
              <label className={styles.checkboxLabel} htmlFor="hidden">Ocultar matéria</label>
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.modalCancel} ${styles.modalActionsButton}`}
                type="button"
                onClick={onClose}
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