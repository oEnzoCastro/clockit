'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import styles from './style.module.css'
import Image from 'next/image'
import Pen from '../../../public/pencil-simple.svg'
import Trash from '../../../public/trash.svg'
import Cancel from '../../../public/x.svg'
import { useAuth } from '@/contexts/AuthContext'

type Area = {
  id: string
  area_name: string
}

type AgentProps = {
  id: string
  first_name: string
  surname: string
  email: string
  area?: { id: string; name?: string; acronym?: string } | null
  onDeleted?: () => Promise<void> | void
  onUpdated?: () => Promise<void> | void
}

type Sector = {
  id: string
  sector_name: string
  acronym?: string
}

type AgentSectorLink = {
  sector_id: string
  sector_name: string
  acronym?: string
  agent_workload?: number | null
  sector_region?: string | null
  sector_location?: string | null
  description?: string | null
  is_hidden?: boolean
  contract_start?: string | null
  contract_end?: string | null
}

export default function Agent(props: AgentProps) {
  const { accessToken } = useAuth()

  const [del, setDel] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [areas, setAreas] = useState<Area[]>([])

  // edição do monitor
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [selectedAreaId, setSelectedAreaId] = useState('')

  // matérias vinculadas
  const [agentSectors, setAgentSectors] = useState<AgentSectorLink[]>([])
  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [selectedSectorId, setSelectedSectorId] = useState('')

  // dados do vínculo agentSector.create
  const [agentWorkload, setAgentWorkload] = useState('')
  const [sectorRegion, setSectorRegion] = useState('')
  const [sectorLocation, setSectorLocation] = useState('')
  const [description, setDescription] = useState('')
  const [isHidden, setIsHidden] = useState(false)
  const [sectorContractStart, setSectorContractStart] = useState('')
  const [sectorContractEnd, setSectorContractEnd] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/areas/get')
      .then((res) => res.json())
      .then((json) => setAreas(json.data || []))
      .catch((err) => console.error('Erro ao buscar áreas:', err))
  }, [])

  const normalizeLinkedSectors = (data: any[]): AgentSectorLink[] => {
    if (!Array.isArray(data) || data.length === 0) return []

    const firstAgent = data[0]
    const sectors = Array.isArray(firstAgent?.sectors) ? firstAgent.sectors : []

    return sectors.map((sector: any) => ({
      sector_id: sector.id,
      sector_name: sector.sector_name ?? 'Matéria',
      acronym: sector.acronym,
      agent_workload: sector.agent_workload ?? null,
      sector_region: sector.sector_region ?? null,
      sector_location: sector.sector_location ?? null,
      description: sector.description ?? null,
      is_hidden: sector.is_hidden ?? false,
      contract_start: sector.contract_start ?? null,
      contract_end: sector.contract_end ?? null,
    }))
  }

  const resetSectorForm = () => {
    setSelectedSectorId('')
    setAgentWorkload('')
    setSectorRegion('')
    setSectorLocation('')
    setDescription('')
    setIsHidden(false)
    setSectorContractStart('')
    setSectorContractEnd('')
  }

  const openEditModal = async () => {
    setFirstName(props.first_name || '')
    setSurname(props.surname || '')
    setEmail(props.email || '')
    setSelectedAreaId(props.area?.id || '')

    setAgentSectors([])
    setAllSectors([])

    try {
      const linkedRes = await fetch(
        `http://localhost:5000/agentSectors/get?agent_id=${props.id}`
      )

      let linkedJson: any = { data: [] }

      if (linkedRes.ok) {
        linkedJson = await linkedRes.json()
      }

      setAgentSectors(normalizeLinkedSectors(linkedJson.data || []))

      const allRes = await fetch('http://localhost:5000/sectors/get')
      const allJson = await allRes.json()
      setAllSectors(allJson.data || [])

      setIsModalOpen(true)
    } catch (err) {
      console.error('Erro ao abrir edição do monitor:', err)
      setAgentSectors([])
      setIsModalOpen(true)
    }
  }

  const closeEditModal = () => {
    setIsModalOpen(false)
    resetSectorForm()
  }

  const availableSectors = useMemo(() => {
    return allSectors.filter(
      (sector) => !agentSectors.some((linked) => linked.sector_id === sector.id)
    )
  }, [allSectors, agentSectors])

  const handleDeleteAgent = async () => {
    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return
    }

    try {
      const res = await fetch(`http://localhost:5000/agents/delete/${props.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const text = await res.text()

      let data: any = null
      try {
        data = JSON.parse(text)
      } catch { }

      if (!res.ok) {
        alert(data?.message || data?.error || text || 'Erro ao deletar monitor')
        return
      }
      props.onDeleted?.()
    } catch (err) {
      console.error(err)
      alert('Erro ao deletar monitor')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accessToken) return alert('Sessão expirada. Faça login novamente.')
    if (!selectedAreaId) return alert('Selecione uma área.')

    try {
      const res = await fetch('http://localhost:5000/agents/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: props.id,
          first_name: firstName,
          surname,
          email,
          area: { id: selectedAreaId },
        }),
      })

      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch { }

      if (!res.ok) {
        return alert(data?.message || data?.error || text || 'Erro ao editar monitor')
      }

      await props.onUpdated?.()
    } catch (err) {
      console.error(err)
      alert('Erro ao editar monitor')
    }
  }

  const handleAddSector = async () => {
    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return
    }

    if (!selectedSectorId) {
      alert('Selecione uma matéria.')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/agentSectors/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sector_id: selectedSectorId,
          agent_id: props.id,
          agent_workload: agentWorkload ? Number(agentWorkload) : null,
          sector_region: sectorRegion || null,
          sector_location: sectorLocation || null,
          description: description || null,
          is_hidden: isHidden,
          contract_start: sectorContractStart || null,
          contract_end: sectorContractEnd || null,
          daySchedules: [],
        }),
      })

      const text = await res.text()

      let data: any = null
      try {
        data = JSON.parse(text)
      } catch { }

      if (!res.ok) {
        alert(data?.message || data?.error || text || 'Erro ao adicionar matéria')
        return
      }

      const sectorFound = allSectors.find((s) => s.id === selectedSectorId)

      setAgentSectors((prev) => [
        ...prev,
        {
          sector_id: selectedSectorId,
          sector_name: sectorFound?.sector_name || 'Matéria',
          acronym: sectorFound?.acronym,
          agent_workload: agentWorkload ? Number(agentWorkload) : null,
          sector_region: sectorRegion || null,
          sector_location: sectorLocation || null,
          description: description || null,
          is_hidden: isHidden,
          contract_start: sectorContractStart || null,
          contract_end: sectorContractEnd || null,
        },
      ])

      resetSectorForm()
    } catch (err) {
      console.error(err)
      alert('Erro ao adicionar matéria')
    }
  }

  const handleRemoveSector = async (sectorId: string) => {
    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return
    }

    try {
      const res = await fetch(
        `http://localhost:5000/agentSectors/delete/${props.id}/${sectorId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const text = await res.text()

      let data: any = null
      try {
        data = JSON.parse(text)
      } catch { }

      if (!res.ok) {
        alert(data?.message || data?.error || text || 'Erro ao remover matéria')
        return
      }

      setAgentSectors((prev) =>
        prev.filter((sector) => sector.sector_id !== sectorId)
      )
    } catch (err) {
      console.error(err)
      alert('Erro ao remover matéria')
    }
  }

  return (
    <>
      <div
        ref={ref}
        className={`${styles.agent} ${del ? styles.delMode : ''}`}
      >
        {!del ? (
          <div className={`${styles.default} ${styles.box}`}>
            <h2 className={styles.agentTitle}>
              {props.first_name} {props.surname}
            </h2>
            <div className={styles.agentEdit}>
              <Image className={styles.pen} src={Pen} alt="Pen" onClick={openEditModal} />
              <Image className={styles.trash} src={Trash} alt="Trash" onClick={() => setDel(true)} />
            </div>
          </div>
        ) : (
          <div className={`${styles.delete} ${styles.box}`}>
            <h2 className={styles.agentTitle}>Deletar?</h2>
            <div className={styles.agentEdit}>
              <button
                type="button"
                className={styles.deleteAgent}
                onClick={handleDeleteAgent}
              >
                <Image className={styles.trueTrash} src={Trash} alt="Trash" />
              </button>
              <Image className={styles.cancel} src={Cancel} alt="Cancel" onClick={() => setDel(false)} />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <section className={styles.modalOverlay}>
          <form className={styles.modal} onSubmit={handleUpdate}>

            <article className={styles.inputs}>
              <h2>Editar Monitor</h2>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Nome"
                className={styles.input}
              />

              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                placeholder="Sobrenome"
                className={styles.input}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className={styles.input}
              />

              <select
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(e.target.value)}
                required
                className={`${styles.input} ${styles.select}`}
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
              <div className={styles.sectorButtons}>
                <button
                  type="button"
                  className={`${styles.addButton} ${styles.styleButton}`}
                  onClick={closeEditModal}>
                  Cancelar
                </button>

                <button
                  className={`${styles.cancelButton} ${styles.styleButton}`}
                  type="submit"
                >
                  Salvar
                </button>
              </div>
            </article>

            <article className={styles.sectors}>
              <div className={styles.sectorHeader}>
                <h2>Matérias</h2>
              </div>

              <div className={styles.sectorList}>
                {agentSectors.length === 0 ? (
                  <p className={styles.emptyText}>Nenhuma matéria vinculada</p>
                ) : (
                  agentSectors.map((sector) => (
                    <div key={sector.sector_id} className={styles.sectorItem}>
                      <div className={styles.sectorInfo}>
                        <span className={styles.sectorName}>{sector.sector_name}</span>
                        {sector.acronym && (
                          <span className={styles.sectorAcronym}>{sector.acronym}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className={styles.removeSectorButton}
                        onClick={() => handleRemoveSector(sector.sector_id)}
                      >
                        Remover
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.sectorBody}>
                <div className={styles.addSectorBox}>
                  <select
                    value={selectedSectorId}
                    onChange={(e) => setSelectedSectorId(e.target.value)}
                    className={`${styles.input} ${styles.select}`}
                  >
                    <option value="">Selecione uma matéria</option>
                    {availableSectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.sector_name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="0"
                    value={agentWorkload}
                    onChange={(e) => setAgentWorkload(e.target.value)}
                    placeholder="Carga horária"
                    className={styles.input}
                  />

                  <input
                    type="text"
                    value={sectorRegion}
                    onChange={(e) => setSectorRegion(e.target.value)}
                    placeholder="Região"
                    className={styles.input}
                  />

                  <input
                    type="text"
                    value={sectorLocation}
                    onChange={(e) => setSectorLocation(e.target.value)}
                    placeholder="Local"
                    className={styles.input}
                  />

                  <div className={styles.dates}>
                    <p>Início do contrato</p>

                    <input
                      type="date"
                      value={sectorContractStart}
                      onChange={(e) => setSectorContractStart(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição"
                    className={styles.input}
                  />

                  <div className={styles.dates}>
                    <p>Fim do contrato</p>
                    <input
                      type="date"
                      value={sectorContractEnd}
                      onChange={(e) => setSectorContractEnd(e.target.value)}
                      className={styles.input}
                    />
                  </div>


                  <label className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={isHidden}
                      onChange={(e) => setIsHidden(e.target.checked)}
                    />
                    Ocultar vínculo
                  </label>


                </div>

                <div className={styles.sectorButtons}>
                  <button
                    type="button"
                    className={`${styles.addButton} ${styles.styleButton}`}
                    onClick={handleAddSector}
                  >
                    Adicionar matéria
                  </button>
                  <button
                    type="button"
                    className={`${styles.cancelButton} ${styles.styleButton}`}
                    onClick={closeEditModal}
                  >
                    Cancelar
                  </button>
                </div>
              </div>

            </article>

          </form >
        </section >
      )
      }
    </>
  )
}