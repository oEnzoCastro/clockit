'use client'

import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

import Pen from '../../../public/pencil-simple.svg'
import Trash from '../../../public/trash.svg'
import Cancel from '../../../public/x.svg'
import ConfirmWhite from '../../../public/check-white.svg'

interface SectorProps {
  id: string
  name: string
  acronym: string
  areaId: string
  isHidden: boolean
  onUpdated?: (updated: any) => void
  onDeleted?: (deletedId: string) => void
}

export default function Sector({
  id,
  name,
  acronym,
  areaId,
  isHidden,
  onUpdated,
  onDeleted,
}: SectorProps) {
  const { accessToken } = useAuth()

  const [open, setOpen] = useState(false)
  const [del, setDel] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const [nome, setNome] = useState(name)

  const [sigla, setSigla] = useState(acronym)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const pathname = usePathname()
  const isSetoresPage = pathname === '/dashboard/agentes/setores'

  useEffect(() => setNome(name), [name])
  useEffect(() => setSigla(acronym), [acronym])

  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     const target = event.target as Node | null
  //     if (ref.current && target && !ref.current.contains(target)) {
  //       setOpen(false)
  //     }
  //   }

  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => document.removeEventListener('mousedown', handleClickOutside)
  // }, [])

  const requireToken = () => {
    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return false
    }
    return true
  }

  const parseJsonSafe = async (res: Response) => {
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      return { message: text }
    }
  }

  const resetEditState = () => {
    setNome(name)
    setSigla(acronym)
    setOpen(false)

  }

  const saveUpdate = async () => {
    if (!requireToken()) return
    if (saving) return

    const payload = {
      id,
      sector_name: nome,
      acronym: sigla,
      area_id: areaId,
      is_hidden: Boolean(isHidden),
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

      const data = await parseJsonSafe(res)

      if (!res.ok) {
        alert(data?.message || data?.error || 'Erro ao atualizar matéria')
        return
      }

      const updated = data?.data || payload

      onUpdated?.({
        id,
        sector_name: updated.sector_name ?? nome,
        acronym: updated.acronym ?? sigla,
        is_hidden: updated.is_hidden ?? Boolean(isHidden),
      })

    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar matéria')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!requireToken()) return
    if (deleting) return

    try {
      setDeleting(true)

      const res = await fetch(`http://localhost:5000/sectors/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await parseJsonSafe(res)

      if (!res.ok) {
        alert(data?.message || data?.error || 'Erro ao deletar matéria')
        return
      }

      onDeleted?.(id)
      setDel(false)
      setOpen(false)
    } catch (err) {
      console.error(err)
      alert('Erro ao deletar matéria')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div ref={ref} className={`${styles.sector} ${del ? styles.delMode : ''}`}>
        {!del && (
          <div className={`${styles.default} ${styles.box}`}>
            <h2 className={styles.sectorTitle}>{nome}</h2>

            <div className={styles.sectorEdit}>
              {!isSetoresPage && (
                <Image
                  className={styles.pen}
                  src={Pen}
                  alt="Pen"
                  onClick={() => {
                    setOpen(true)
                  }}
                />
              )}
              <Image
                className={styles.trash}
                src={Trash}
                alt="Trash"
                onClick={() => setDel(true)}
              />
            </div>
          </div>
        )}

        {del && (
          <div className={`${styles.delete} ${styles.box}`}>
            <h2 className={styles.sectorTitle}>Deletar?</h2>
            <div className={styles.sectorEdit}>
              <Image
                className={styles.trueTrash}
                src={Trash}
                alt="Trash"
                onClick={confirmDelete}
              />
              <Image
                className={styles.cancel}
                src={Cancel}
                alt="Cancel"
                onClick={() => setDel(false)}
              />
            </div>
          </div>
        )}
      </div>

      {open && !isSetoresPage && (
        <div className={styles.modalOverlay} onClick={resetEditState}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTittle}>Editar matéria</h2>

              <div className={styles.closeBtn}>
                <Image
                  src={Cancel}
                  alt="fechar"
                  onClick={resetEditState}
                />
              </div>
            </div>

            <div className={styles.sectorContent}>
              <div className={styles.field}>
                <input
                  className={styles.editing}
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome da matéria"
                />
              </div>

              <div className={styles.field}>
                <input
                  className={styles.editing}
                  type="text"
                  value={sigla}
                  onChange={(e) => setSigla(e.target.value)}
                  placeholder="Sigla"
                />
              </div>

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
      )}
    </>
  )
}