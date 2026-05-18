'use client'

import React, { useState } from 'react'
import styles from './style.module.css'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

import Pen from '../../../public/pencil-simple.svg'
import Trash from '../../../public/trash.svg'
import Cancel from '../../../public/x.svg'
import EditSectorModal from '../EditSectorModal/EditSectorModal'

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
  const [deleting, setDeleting] = useState(false)

  const pathname = usePathname()
  const isSetoresPage = pathname === '/dashboard/agentes/setores'

  const confirmDelete = async () => {
    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return
    }
    if (deleting) return

    try {
      setDeleting(true)
      const res = await fetch(`http://localhost:5000/sectors/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!res.ok) {
        const text = await res.text()
        alert(text || 'Erro ao deletar matéria')
        return
      }

      onDeleted?.(id)
      setDel(false)
    } catch (err) {
      console.error(err)
      alert('Erro ao deletar matéria')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className={`${styles.sector} ${del ? styles.delMode : ''}`}>
        {!del ? (
          <div className={styles.box}>
            <span className={styles.sectorTitle}>{name}</span>
            <div className={styles.sectorEdit}>
              {!isSetoresPage && (
                <button className={styles.iconBtn} type="button" onClick={() => setOpen(true)}>
                  <Image src={Pen} alt="Editar" width={18} height={18} />
                </button>
              )}
              <button className={styles.iconBtn} type="button" onClick={() => setDel(true)}>
                <Image src={Trash} alt="Deletar" width={18} height={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.box}>
            <span className={styles.sectorTitle}>Deletar?</span>
            <div className={styles.sectorEdit}>
              <button className={styles.iconBtnConfirm} type="button" onClick={confirmDelete} disabled={deleting}>
                <Image src={Trash} alt="Confirmar Deletar" width={18} height={18} />
              </button>
              <button className={styles.iconBtnConfirm} type="button" onClick={() => setDel(false)}>
                <Image src={Cancel} alt="Cancelar" width={18} height={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <EditSectorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        id={id}
        name={name}
        acronym={acronym}
        areaId={areaId}
        isHidden={isHidden}
        accessToken={accessToken}
        onUpdated={onUpdated}
      />
    </>
  )
}