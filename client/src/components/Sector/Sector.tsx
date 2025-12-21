'use client'

import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import Pen from '../../../public/pencil-simple.svg'
import Trash from '../../../public/trash.svg'
import Cancel from '../../../public/x.svg'
import ConfirmWhite from '../../../public/check-white.svg'

export default function Setor() {
  const [open, setOpen] = useState(false)
  const [del, setDel] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const [editNome, setEditNome] = useState(false)
  const [nome, setNome] = useState('Exemplo de nome')

  const [editSigla, setEditSigla] = useState(false)
  const [sigla, setSigla] = useState('Exemplo de sigla')

  const pathname = usePathname()
  const isSetoresPage = pathname === '/dashboard/agentes/setores'

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

  return (
    <div
      ref={ref}
      className={`sector ${open ? 'open' : 'close'} ${del ? 'delMode' : ''}`}
    >

      {/* NORMAL */}
      {!del && (
        <div className="default box">
          <div className="sectorHeader">
            <h2 className="sectorTitle">Setor 1</h2>

            <div className="sectorEdit">

              {/* BOTÕES QUANDO FECHADO */}
              {!open && (
                <>
                  {/* LIXEIRA SEMPRE VISÍVEL */}
                  <Image
                    className="trash"
                    src={Trash}
                    alt="Trash"
                    onClick={() => setDel(true)}
                  />

                  {/* CANETA SÓ FORA DA PÁGINA DE SETORES */}
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

              {/* BOTÃO FECHAR */}
              {open && !isSetoresPage && (
                <Image
                  className="closeBtn"
                  src={Cancel}
                  alt="fechar"
                  onClick={() => setOpen(false)}
                />
              )}

            </div>
          </div>

          <div className="sectorContent">

            {/* NOME */}
            <div className="field">
              <input
                className={editNome ? 'editing' : ''}
                type="text"
                value={nome}
                readOnly={!editNome || isSetoresPage}
                onChange={(e) => setNome(e.target.value)}
              />

              {!editNome && !isSetoresPage && (
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
                    onClick={() => setEditNome(false)}
                  />
                </div>
              )}
            </div>

            {/* SIGLA */}
            <div className="field">
              <input
                className={editSigla ? 'editing' : ''}
                type="text"
                value={sigla}
                readOnly={!editSigla || isSetoresPage}
                onChange={(e) => setSigla(e.target.value)}
              />

              {!editSigla && !isSetoresPage && (
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
                    onClick={() => setEditSigla(false)}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODO DELETAR */}
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
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
