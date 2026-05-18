'use client'

import React, { useState } from 'react'
import styles from './style.module.css'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

import Pen from '../../../public/pencil-simple.svg'
import Trash from '../../../public/trash.svg'
import Cancel from '../../../public/x.svg'
import EditAgentModal from '../EditAgentModal/EditAgentModal'

type AgentProps = {
  id: string
  first_name: string
  surname: string
  email: string
  area?: { id: string; name?: string; acronym?: string } | null
  onDeleted?: () => Promise<void> | void
  onUpdated?: () => Promise<void> | void
}

export default function Agent(props: AgentProps) {
  const { accessToken } = useAuth()
  const [del, setDel] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDeleteAgent = async () => {
    if (!accessToken) return
    try {
      const res = await fetch(`http://localhost:5000/agents/delete/${props.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) return
      props.onDeleted?.()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className={`${styles.agent} ${del ? styles.delMode : ''}`}>
        {!del ? (
          <div className={styles.box}>
            <h2 className={styles.agentTitle}>
              {props.first_name} {props.surname}
            </h2>
            <div className={styles.agentEdit}>
              <button type="button" className={styles.iconBtn} onClick={() => setIsModalOpen(true)}>
                <Image src={Pen} alt="Editar" width={18} height={18} />
              </button>
              <button type="button" className={styles.iconBtn} onClick={() => setDel(true)}>
                <Image src={Trash} alt="Deletar" width={18} height={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.box}>
            <h2 className={styles.agentTitle}>Deletar?</h2>
            <div className={styles.agentEdit}>
              <button type="button" className={styles.iconBtnConfirm} onClick={handleDeleteAgent}>
                <Image src={Trash} alt="Confirmar" width={18} height={18} />
              </button>
              <button type="button" className={styles.iconBtnConfirm} onClick={() => setDel(false)}>
                <Image src={Cancel} alt="Cancelar" width={18} height={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <EditAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agentId={props.id}
        firstName={props.first_name}
        surname={props.surname}
        email={props.email}
        currentAreaId={props.area?.id || ''}
        accessToken={accessToken}
        onUpdated={props.onUpdated}
      />
    </>
  )
}