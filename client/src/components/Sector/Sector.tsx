'use client'

import React, { useState, useEffect, useRef } from 'react'
import './style.css'
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

  const [editNome, setEditNome] = useState(false)
  const [nome, setNome] = useState(name)

  const [editSigla, setEditSigla] = useState(false)
  const [sigla, setSigla] = useState(acronym)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const pathname = usePathname()
  const isSetoresPage = pathname === '/dashboard/agentes/setores'

  useEffect(() => setNome(name), [name])
  useEffect(() => setSigla(acronym), [acronym])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node | null
      if (ref.current && target && !ref.current.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const requireToken = () => {
    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return false
    }
    return true
  }

  const saveUpdate = async () => {
    if (!requireToken()) return
    if (saving) return

    const payload = {
      sector_id: id,
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
      try {
        data = JSON.parse(text)
      } catch {}

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

      setEditNome(false)
      setEditSigla(false)
      setOpen(false)
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

      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch {}

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
    <div
      ref={ref}
      className={`sector ${open ? 'open' : 'close'} ${del ? 'delMode' : ''}`}
    >
      {!del && (
        <div className="default box">
          <div className="sectorHeader">
            <h2 className="sectorTitle">{nome}</h2>

            <div className="sectorEdit">
              {!open && (
                <>
                  <Image
                    className="trash"
                    src={Trash}
                    alt="Trash"
                    onClick={() => setDel(true)}
                  />

                  {!isSetoresPage && (
                    <Image
                      className="pen"
                      src={Pen}
                      alt="Pen"
                      onClick={() => setOpen(true)}
                    />
                  )}
                </>
              )}

              {open && !isSetoresPage && (
                <Image
                  className="closeBtn"
                  src={Cancel}
                  alt="fechar"
                  onClick={() => {
                    setOpen(false)
                    setEditNome(false)
                    setEditSigla(false)
                    setNome(name)
                    setSigla(acronym)
                  }}
                />
              )}
            </div>
          </div>

          <div className="sectorContent">
            <div className="field">
              <input
                className={editNome ? 'editing' : ''}
                type="text"
                value={nome}
                readOnly={!editNome || isSetoresPage}
                onChange={(e) => setNome(e.target.value)}
              />

              {!editNome && !isSetoresPage && open && (
                <Image
                  src={Pen}
                  alt="editar"
                  className="icon"
                  onClick={() => setEditNome(true)}
                />
              )}

              {editNome && !isSetoresPage && (
                <div className="confirmBtn">
                  <Image
                    src={ConfirmWhite}
                    alt="confirmar"
                    onClick={saveUpdate}
                  />
                </div>
              )}
            </div>

            <div className="field">
              <input
                className={editSigla ? 'editing' : ''}
                type="text"
                value={sigla}
                readOnly={!editSigla || isSetoresPage}
                onChange={(e) => setSigla(e.target.value)}
              />

              {!editSigla && !isSetoresPage && open && (
                <Image
                  src={Pen}
                  alt="editar"
                  className="icon"
                  onClick={() => setEditSigla(true)}
                />
              )}

              {editSigla && !isSetoresPage && (
                <div className="confirmBtn">
                  <Image
                    src={ConfirmWhite}
                    alt="confirmar"
                    onClick={saveUpdate}
                  />
                </div>
              )}
            </div>

            {!isSetoresPage && open && (editNome || editSigla) && (
              <button
                type="button"
                disabled={saving}
                onClick={saveUpdate}
                style={{ marginTop: 10 }}
              >
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            )}
          </div>
        </div>
      )}

      {del && (
        <div className="delete box">
          <div className="sectorHeader">
            <h2 className="sectorTitle">Deletar?</h2>

            <div className="sectorEdit">
              <Image
                className="cancel"
                src={Cancel}
                alt="Cancel"
                onClick={() => setDel(false)}
              />
              <Image
                className="trueTrash"
                src={Trash}
                alt="Trash"
                onClick={confirmDelete}
              />
            </div>
          </div>

          <div style={{ padding: 12 }}>
            <p>Você tem certeza que deseja deletar?</p>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              style={{ marginTop: 10 }}
            >
              {deleting ? 'Deletando...' : 'Confirmar delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 