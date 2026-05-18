'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useProtectedPage } from '@/hooks/useProtectedPage'
import { useAuth } from '@/contexts/AuthContext'
import styles from './style.module.css'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Sidebar from '../../../../components/Sidebar/Sidebar'
import Sector from '../../../../components/Sector/Sector'
import NewSectorModal from '../../../../components/NewSectorModal/NewSectorModal'

export default function Page() {
  const { checking } = useProtectedPage(['manager'])
  const { accessToken } = useAuth()

  const params = useParams()
  const areaId = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string)

  const [areaNome, setAreaNome] = useState('')
  const [sectors, setSectors] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!areaId) return

    fetch(`http://localhost:5000/areas/${areaId}`)
      .then((res) => res.json())
      .then((json) => {
        setAreaNome(json.data.area_name)
      })
      .catch((err) => console.error('Erro ao buscar área:', err))
  }, [areaId])

  useEffect(() => {
    if (!areaId) return

    fetch(`http://localhost:5000/sectors/get?area_id=${areaId}`)
      .then((res) => {
        if (!res.ok) return { data: [] }
        return res.json()
      })
      .then((json) => {
        setSectors(json.data || [])
      })
      .catch((err) => console.error('Erro ao buscar matérias:', err))
  }, [areaId])

  if (checking) return <div>Carregando...</div>

  return (
    <main className={styles.main}>
      <Sidebar />

      <section className={styles.mainContent}>
        <header className={styles.mainHeader}>
          <Link className={styles.arrowBack} href="/dashboard/areas">
            <Image
              src="/arrow-u-up-left.svg"
              alt="Voltar"
              width={20}
              height={20}
            />
          </Link>

          <button
            className={styles.newSector}
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src="/plus.svg"
              alt="Plus"
              width={20}
              height={20}
            />
            <span className={styles.newSectorLabel}>Nova matéria</span>
          </button>

          <h1 className={styles.titleArea}>{areaNome || 'Carregando...'}</h1>
        </header>

        <section className={styles.setores}>
          {sectors.length === 0 ? (
            <p className={styles.emptyMessage}>Nenhuma matéria neste curso</p>
          ) : (
            sectors.map((sector) => (
              <Sector
                key={sector.id}
                id={sector.id}
                name={sector.sector_name}
                acronym={sector.acronym}
                areaId={areaId}
                isHidden={Boolean(sector.is_hidden)}
                onUpdated={(updated) => {
                  setSectors((prev) =>
                    prev.map((s) =>
                      s.id === updated.id
                        ? {
                          ...s,
                          sector_name: updated.sector_name,
                          acronym: updated.acronym,
                          is_hidden: updated.is_hidden,
                        }
                        : s
                    )
                  )
                }}
                onDeleted={(deletedId) => {
                  setSectors((prev) => prev.filter((s) => s.id !== deletedId))
                }}
              />
            ))
          )}
        </section>
      </section>

      <NewSectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accessToken={accessToken}
        areaId={areaId}
        onSectorCreated={(newSector) => setSectors((prev) => [...prev, newSector])}
      />
    </main>
  )
}