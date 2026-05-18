'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './style.module.css'
import Cancel from '../../../public/x.svg'

type EditSectorModalProps = {
  isOpen: boolean
  onClose: () => void
  id: string
  name: string
  acronym: string
  areaId: string
  isHidden: boolean
  accessToken: string | null
  onUpdated?: (updated: any) => void
}

export default function EditSectorModal({
  isOpen,
  onClose,
  id,
  name,
  acronym,
  areaId,
  isHidden,
  accessToken,
  onUpdated,
}: EditSectorModalProps) {
  const [nome, setNome] = useState(name)
  const [sigla, setSigla] = useState(acronym)
  const [saving, setSaving] = useState(false)

  useEffect(() => setNome(name), [name])
  useEffect(() => setSigla(acronym), [acronym])

  const saveUpdate = async () => {
    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return
    }
    if (saving) return

    const payload = {
      id,
      sector_name: nome,
      acronym: sigla,
      area_id: areaId,
      is_hidden: isHidden,
    }

    try {
      setSaving(true)
      const res = await fetch('http://localhost:5000/sectors/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      let data: any = null
      try { data = JSON.parse(text) } catch { data = { message: text } }

      if (!res.ok) {
        alert(data?.message || data?.error || 'Erro ao atualizar matéria')
        return
      }

      const updated = data?.data || payload
      onUpdated?.({
        id,
        sector_name: updated.sector_name ?? nome,
        acronym: updated.acronym ?? sigla,
        is_hidden: updated.is_hidden ?? isHidden,
      })
      onClose()
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar matéria')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Editar matéria</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <Image src={Cancel} alt="Fechar" width={20} height={20} />
          </button>
        </div>

        <div className={styles.sectorContent}>
          <input
            className={styles.editing}
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da matéria"
          />

          <input
            className={styles.editing}
            type="text"
            value={sigla}
            onChange={(e) => setSigla(e.target.value)}
            placeholder="Sigla"
          />

          <button
            type="button"
            className={styles.modalCreate}
            disabled={saving}
            onClick={saveUpdate}
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}