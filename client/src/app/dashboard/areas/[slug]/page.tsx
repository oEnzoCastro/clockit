'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import { useParams } from 'next/navigation'
import './setores_areas.css'
import Image from 'next/image'
import Link from 'next/link'
import { useProtectedPage } from '@/hooks/useProtectedPage'
import { useAuth } from '@/contexts/AuthContext'

import Sidebar from '../../../../components/Sidebar/Sidebar'
import Sector from '../../../../components/Sector/Sector'

export default function Page() {
  const { checking } = useProtectedPage(['manager'])
  const { accessToken } = useAuth()

  const params = useParams()
  const areaId =
    Array.isArray(params.slug) ? params.slug[0] : (params.slug as string)

  const [areaNome, setAreaNome] = useState('')
  const [sectors, setSectors] = useState<any[]>([])

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form
  const [sectorName, setSectorName] = useState('')
  const [acronym, setAcronym] = useState('')
  const [isHidden, setIsHidden] = useState(false)

  // ---------------- BUSCAR ÁREA ----------------
  useEffect(() => {
    if (!areaId) return

    fetch(`http://localhost:5000/areas/${areaId}`)
      .then((res) => res.json())
      .then((json) => {
        setAreaNome(json.data.area_name)
      })
      .catch((err) => console.error('Erro ao buscar área:', err))
  }, [areaId])

  // ---------------- BUSCAR MATÉRIAS ----------------
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

  // ---------------- CRIAR MATÉRIA ----------------
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
      } catch {}

      if (!res.ok) {
        alert(data?.message || data?.error || 'Erro ao criar matéria')
        return
      }

      setSectors((prev) => [...prev, data.data])

      setSectorName('')
      setAcronym('')
      setIsHidden(false)
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      alert('Erro ao criar matéria')
    }
  }

  if (checking) return <div>Carregando...</div>

  return (
    <main>
      <Sidebar />

      <section className="mainContent">
        <article className="mainHeader">
          <Link className="arrowBack" href="/dashboard/areas">
            <Image
              src="/arrow-u-up-left.svg"
              alt="arrow back"
              width={24}
              height={24}
            />
          </Link>

          <button
            className="newSector"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              className="plus"
              src="/plus.svg"
              alt="Plus"
              width={24}
              height={24}
            />
            <h2>Nova matéria</h2>
          </button>

          <h2 className="titleArea">{areaNome || 'Carregando...'}</h2>
        </article>

        <article className="setores">
          {sectors.length === 0 ? (
            <p className="emptyMessage">Nenhuma matéria neste curso</p>
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
        </article>
      </section>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Nova Matéria</h2>

            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <input
                  type="text"
                  value={sectorName}
                  onChange={(e) => setSectorName(e.target.value)}
                  required
                  placeholder="Nome da matéria"
                />

                <input
                  type="text"
                  maxLength={10}
                  value={acronym}
                  onChange={(e) => setAcronym(e.target.value)}
                  required
                  placeholder="Sigla"
                />

                <div className="checkbox">
                  <input
                    type="checkbox"
                    id="hidden"
                    checked={isHidden}
                    onChange={(e) => setIsHidden(e.target.checked)}
                  />
                  <label htmlFor="hidden">Ocultar matéria</label>
                </div>

                <div className="modalActions">
                  <button
                    className="modalCancel"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>

                  <button className="modalCreate" type="submit">
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