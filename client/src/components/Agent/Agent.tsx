'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import './Agent.css'
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
  // no seu backend, "area" costuma vir como objeto { id, name, acronym }
  area?: { id: string; name?: string; acronym?: string } | null
  contract_start?: string | null
  contract_end?: string | null
}

export default function Agent(props: AgentProps) {
  const { accessToken } = useAuth()

  const [del, setDel] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [areas, setAreas] = useState<Area[]>([])

  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [selectedAreaId, setSelectedAreaId] = useState('')
  const [contractStart, setContractStart] = useState('')
  const [contractEnd, setContractEnd] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/areas/get')
      .then((res) => res.json())
      .then((json) => setAreas(json.data || []))
      .catch((err) => console.error('Erro ao buscar áreas:', err))
  }, [])

  const openEditModal = () => {
    setFirstName(props.first_name || '')
    setSurname(props.surname || '')
    setEmail(props.email || '')
    setSelectedAreaId(props.area?.id || '')
    setContractStart(props.contract_start || '')
    setContractEnd(props.contract_end || '')
    setIsModalOpen(true)
  }

  const closeEditModal = () => {
    setIsModalOpen(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
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

          contract_start: contractStart || null,
          contract_end: contractEnd || null,
        }),
      })

      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch {}

      if (!res.ok) {
        alert(data?.message || data?.error || text || 'Erro ao editar monitor')
        return
      }

      alert('Monitor editado com sucesso!')
      closeEditModal()

    } catch (err) {
      console.error(err)
      alert('Erro ao editar monitor')
    }
  }

  return (
    <>
      <div ref={ref} className={`sector ${del ? 'delMode' : ''}`}>
        {!del && (
          <div className="default box">
            <h2 className="sectorTitle">
              {props.first_name} {props.surname}
            </h2>
            <div className="sectorEdit">
              <Image className="pen" src={Pen} alt="Pen" onClick={openEditModal} />
              <Image className="trash" src={Trash} alt="Trash" onClick={() => setDel(true)} />
            </div>
          </div>
        )}

        {del && (
          <div className="delete box">
            <h2 className="sectorTitle">Deletar?</h2>
            <div className="sectorEdit">
              <Image className="cancel" src={Cancel} alt="Cancel" onClick={() => setDel(false)} />
              <Image className="trueTrash" src={Trash} alt="Trash" />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Editar Monitor</h2>

            <form onSubmit={handleUpdate}>
              <div className="formGroup">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Nome"
                  className="inputs"
                />

                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  placeholder="Sobrenome"
                  className="inputs"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="inputs"
                />

                <select
                  value={selectedAreaId}
                  onChange={(e) => setSelectedAreaId(e.target.value)}
                  required
                  className="select inputs"
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

                <input
                  type="date"
                  value={contractStart}
                  onChange={(e) => setContractStart(e.target.value)}
                  className="inputs"
                />

                <input
                  type="date"
                  value={contractEnd}
                  onChange={(e) => setContractEnd(e.target.value)}
                  className="inputs"
                />

                <div className="modalActions">
                  <button className="modalCancel" type="button" onClick={closeEditModal}>
                    Cancelar
                  </button>

                  <button className="modalCreate" type="submit">
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}