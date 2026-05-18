'use client'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import styles from './style.module.css'
import Cancel from '../../../public/x.svg'
import TrashWhite from '../../../public/trash-white.svg'

type Area = {
  id: string
  area_name: string
}

type DaySchedule = {
  agent_id: string
  sector_id: string
  schedule_day: string
  schedule: string
}

type DaySchedulesBySector = Record<string, DaySchedule[]>

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

type EditAgentModalProps = {
  isOpen: boolean
  onClose: () => void
  agentId: string
  firstName: string
  surname: string
  email: string
  currentAreaId: string
  accessToken: string | null
  onUpdated?: () => Promise<void> | void
}

export default function EditAgentModal({
  isOpen,
  onClose,
  agentId,
  firstName: initialFirstName,
  surname: initialSurname,
  email: initialEmail,
  currentAreaId,
  accessToken,
  onUpdated,
}: EditAgentModalProps) {
  const [areas, setAreas] = useState<Area[]>([])
  const [firstName, setFirstName] = useState(initialFirstName)
  const [surname, setSurname] = useState(initialSurname)
  const [email, setEmail] = useState(initialEmail)
  const [selectedAreaId, setSelectedAreaId] = useState(currentAreaId)

  const [agentSectors, setAgentSectors] = useState<AgentSectorLink[]>([])
  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [selectedSectorId, setSelectedSectorId] = useState('')

  const [agentWorkload, setAgentWorkload] = useState('')
  const [sectorRegion, setSectorRegion] = useState('')
  const [sectorLocation, setSectorLocation] = useState('')
  const [description, setDescription] = useState('')
  const [isHidden, setIsHidden] = useState(false)
  const [sectorContractStart, setSectorContractStart] = useState('')
  const [sectorContractEnd, setSectorContractEnd] = useState('')

  const [daySchedulesBySector, setDaySchedulesBySector] = useState<DaySchedulesBySector>({})
  const [newScheduleDayBySector, setNewScheduleDayBySector] = useState<Record<string, string>>({})
  const [newScheduleValueBySector, setNewScheduleValueBySector] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isOpen) return
    fetch('http://localhost:5000/areas/get')
      .then((res) => res.json())
      .then((json) => setAreas(json.data || []))
      .catch((err) => console.error('Erro ao buscar áreas:', err))

    loadModalData()
  }, [isOpen])

  const loadModalData = async () => {
    try {
      const linkedRes = await fetch(`http://localhost:5000/agentSectors/get?agent_id=${agentId}`)
      let linkedJson: any = { data: [] }
      if (linkedRes.ok) linkedJson = await linkedRes.json()

      const normalized = normalizeLinkedSectors(linkedJson.data || [])
      setAgentSectors(normalized)

      const allRes = await fetch('http://localhost:5000/sectors/get')
      const allJson = await allRes.json()
      setAllSectors(allJson.data || [])

      for (const sector of normalized) {
        await fetchDaySchedulesBySector(sector.sector_id)
      }
    } catch (err) {
      console.error('Erro ao carregar dados do modal:', err)
    }
  }

  const fetchDaySchedulesBySector = async (sectorId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/daySchedules/get?agent_id=${agentId}&sector_id=${sectorId}`)
      if (!res.ok) {
        setDaySchedulesBySector((prev) => ({ ...prev, [sectorId]: [] }))
        return
      }
      const data = await res.json()
      setDaySchedulesBySector((prev) => ({ ...prev, [sectorId]: data?.data || [] }))
    } catch {
      setDaySchedulesBySector((prev) => ({ ...prev, [sectorId]: [] }))
    }
  }

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

  const isExpired = (dateString?: string | null) => {
    if (!dateString) return false
    return dateString.split('T')[0] < new Date().toISOString().split('T')[0]
  }

  const formatDateBR = (dateString?: string | null) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('T')[0].split('-')
    return `${day}/${month}/${year}`
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

  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken || !selectedAreaId) return

    try {
      const res = await fetch('http://localhost:5000/agents/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: agentId,
          first_name: firstName,
          surname,
          email,
          area: { id: selectedAreaId },
        }),
      })

      if (!res.ok) return
      await onUpdated?.()
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddSector = async () => {
    if (!accessToken || !selectedSectorId) return

    try {
      const res = await fetch('http://localhost:5000/agentSectors/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sector_id: selectedSectorId,
          agent_id: agentId,
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

      if (!res.ok) return

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

      await fetchDaySchedulesBySector(selectedSectorId)
      resetSectorForm()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveSector = async (sectorId: string) => {
    if (!accessToken) return

    try {
      const res = await fetch(`http://localhost:5000/agentSectors/delete/${agentId}/${sectorId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!res.ok) return

      setAgentSectors((prev) => prev.filter((s) => s.sector_id !== sectorId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddDaySchedule = async (sectorId: string) => {
    if (!accessToken) return
    const schedule_day = newScheduleDayBySector[sectorId]
    const schedule = newScheduleValueBySector[sectorId]
    if (!schedule_day || !schedule) return

    try {
      const res = await fetch('http://localhost:5000/daySchedules/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ agent_id: agentId, sector_id: sectorId, schedule_day, schedule }),
      })

      if (!res.ok) return
      const data = await res.json()

      setDaySchedulesBySector((prev) => ({
        ...prev,
        [sectorId]: [...(prev[sectorId] || []), data.data],
      }))
      setNewScheduleDayBySector((prev) => ({ ...prev, [sectorId]: '' }))
      setNewScheduleValueBySector((prev) => ({ ...prev, [sectorId]: '' }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveDaySchedule = async (sectorId: string, scheduleDay: string) => {
    if (!accessToken) return

    try {
      const res = await fetch(`http://localhost:5000/daySchedules/delete/${agentId}/${sectorId}/${scheduleDay}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!res.ok) return

      setDaySchedulesBySector((prev) => ({
        ...prev,
        [sectorId]: (prev[sectorId] || []).filter((item) => item.schedule_day !== scheduleDay),
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const availableSectors = useMemo(() => {
    return allSectors.filter((s) => !agentSectors.some((linked) => linked.sector_id === s.id))
  }, [allSectors, agentSectors])

  if (!isOpen) return null

  return (
    <section className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <form className={styles.modal} onSubmit={handleUpdateAgent}>
          <article className={`${styles.inputs} ${styles.modalArticle}`}>
            <div className={styles.modalHead}>
              <h2 className={styles.articleTitle}>Editar Monitor</h2>
            </div>
            <div className={styles.modalBody}>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Nome" className={styles.input} />
              <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required placeholder="Sobrenome" className={styles.input} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className={styles.input} />
              <select value={selectedAreaId} onChange={(e) => setSelectedAreaId(e.target.value)} required className={`${styles.input} ${styles.select}`}>
                {areas.map((a) => (<option key={a.id} value={a.id}>{a.area_name}</option>))}
              </select>
              <div className={styles.sectorButtons}>
                <button className={`${styles.saveButton} ${styles.styleButton}`} type="submit">Salvar</button>
              </div>
            </div>
          </article>

          <article className={`${styles.addSector} ${styles.modalArticle}`}>
            <div className={styles.modalHead}>
              <h2 className={styles.articleTitle}>Adicionar matéria</h2>
            </div>
            <div className={styles.modalBody}>
              <select value={selectedSectorId} onChange={(e) => setSelectedSectorId(e.target.value)} className={`${styles.input} ${styles.select}`}>
                <option value="">Selecione uma matéria</option>
                {availableSectors.map((s) => (<option key={s.id} value={s.id}>{s.sector_name}</option>))}
              </select>
              <select value={agentWorkload} onChange={(e) => setAgentWorkload(e.target.value)} className={`${styles.input} ${styles.select}`}>
                <option value="">Carga horária</option>
                <option value="10">Carga horária: 10</option>
                <option value="20">Carga horária: 20</option>
              </select>
              <input type="text" value={sectorRegion} onChange={(e) => setSectorRegion(e.target.value)} placeholder="Região (Ex: Prédio 4)" className={styles.input} />
              <input type="text" value={sectorLocation} onChange={(e) => setSectorLocation(e.target.value)} placeholder="Local (Ex: Andar 5 sala 502)" className={styles.input} />
              <div className={styles.dates}><p>Início do contrato</p><input type="date" value={sectorContractStart} onChange={(e) => setSectorContractStart(e.target.value)} className={styles.input} /></div>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className={styles.input} />
              <div className={styles.dates}><p>Fim do contrato</p><input type="date" value={sectorContractEnd} onChange={(e) => setSectorContractEnd(e.target.value)} className={styles.input} /></div>
              <div className={styles.sectorButtons}>
                <button type="button" className={`${styles.addButton} ${styles.styleButton}`} onClick={handleAddSector}>Adicionar matéria</button>
              </div>
            </div>
          </article>

          <article className={`${styles.sectorBox} ${styles.modalArticle}`}>
            <div className={styles.modalHead}>
              <h2 className={styles.articleTitle}>Lista de matérias</h2>
            </div>
            <div className={styles.sectorList}>
              {agentSectors.length === 0 ? (
                <p className={styles.emptyText}>Nenhuma matéria vinculada</p>
              ) : (
                agentSectors.map((sector) => (
                  <div key={sector.sector_id} className={styles.sectorItem}>
                    <h4 className={styles.sectorSubTitle}>Nome:</h4>
                    <div className={styles.sectorInfos}>
                      <p className={styles.sectorText}>{sector.sector_name} | {sector.acronym}</p>
                      <button type="button" className={styles.removeSectorButton} onClick={() => handleRemoveSector(sector.sector_id)}>Remover matéria</button>
                    </div>
                    <h4 className={styles.sectorSubTitle}>Contrato:</h4>
                    <div className={styles.sectorInfos}>
                      <p className={styles.sectorText}>{formatDateBR(sector.contract_start)} até {formatDateBR(sector.contract_end)}</p>
                      {isExpired(sector.contract_end) && (<span className={styles.expired}>Expirado!</span>)}
                    </div>
                    <div className={styles.dayScheduleBox}>
                      <h4 className={styles.sectorSubTitle}>Horários:</h4>
                      {(daySchedulesBySector[sector.sector_id] || []).map((item) => (
                        <div key={`${item.sector_id}-${item.schedule_day}`} className={styles.dayScheduleItem}>
                          <span className={styles.diaHora}>{item.schedule_day} - {item.schedule}</span>
                          <button type="button" className={styles.removeScheduleButton} onClick={() => handleRemoveDaySchedule(item.sector_id, item.schedule_day)}>
                            <Image src={TrashWhite} alt="Remover" width={14} height={14} />
                          </button>
                        </div>
                      ))}
                      <div className={styles.dayScheduleForm}>
                        <select value={newScheduleDayBySector[sector.sector_id] || ''} onChange={(e) => setNewScheduleDayBySector(prev => ({ ...prev, [sector.sector_id]: e.target.value }))} className={`${styles.input} ${styles.select}`}>
                          <option value="">Dia</option><option value="SEG">SEG</option><option value="TER">TER</option><option value="QUA">QUA</option><option value="QUI">QUI</option><option value="SEX">SEX</option>
                        </select>
                        <input type="text" value={newScheduleValueBySector[sector.sector_id] || ''} onChange={(e) => setNewScheduleValueBySector(prev => ({ ...prev, [sector.sector_id]: e.target.value }))} placeholder="08:00-10:00" className={styles.input} />
                        <button type="button" className={`${styles.addButton} ${styles.styleButton}`} onClick={() => handleAddDaySchedule(sector.sector_id)}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </form>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          <Image src={Cancel} alt="Fechar" width={20} height={20} />
        </button>
      </div>
    </section>
  )
}