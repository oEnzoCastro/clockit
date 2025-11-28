'use client'

import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import Image from 'next/image'
import Pen from '../../../public/pencil-simple(1).svg'
import Trash from '../../../public/trash.svg'
import Cancel from '../../../public/x.svg'
import Confirm from '../../../public/check.svg'
import ConfirmWhite from '../../../public/check-white.svg'

export default function Setor() {
  const [open, setOpen] = useState(false)
  const [del, setDel] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const [editNome, setEditNome] = useState(false)
  const [nome, setNome] = useState("Exemplo de nome")
  const [editSigla, setEditSigla] = useState(false)
  const [sigla, setSigla] = useState("Exemplo de sigla")

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
    <div ref={ref} className={`sector ${open ? 'open' : 'close'} ${del ? 'delMode' : ''}`}>

      {/* NORMAL */}
      {!del && (
        <div className="default box">
          <div className='sectorHeader'>
            <h2 className="sectorTitle">Setor 1</h2>
            <div className='sectorEdit'>

              {/* BOTÕES QUANDO O SETOR ESTÁ FECHADO */}
              {!open && (
                <>
                  <Image
                    className='pen'
                    src={Pen}
                    alt='Pen'
                    onClick={() => setOpen(true)}
                  />
                  <Image
                    className='trash'
                    src={Trash}
                    alt='Trash'
                    onClick={() => setDel(true)}
                  />
                </>
              )}

              {/* BOTÃO QUANDO O SETOR ESTÁ ABERTO */}
              {open && (
                <Image
                  className='closeBtn'
                  src={Cancel}
                  alt='fechar'
                  onClick={() => setOpen(false)}
                />
              )}

            </div>
          </div>


          <div className="sectorContent">
            {/* NOME */}
            <div className="field">
              <input
                className={editNome ? "editing" : ""}
                type="text"
                value={nome}
                readOnly={!editNome}
                onChange={(e) => setNome(e.target.value)}
              />

              {!editNome && (
                <Image
                  src={Pen}
                  alt="editar"
                  className="icon"
                  onClick={() => setEditNome(true)}
                />
              )}

              {editNome && (
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
                className={editSigla ? "editing" : ""}
                type="text"
                value={sigla}
                readOnly={!editSigla}
                onChange={(e) => setSigla(e.target.value)}
              />

              {!editSigla && (
                <Image
                  src={Pen}
                  alt="editar"
                  className="icon"
                  onClick={() => setEditSigla(true)}
                />
              )}

              {editSigla && (
                <div className="confirmBtn">

                  <Image
                    src={ConfirmWhite}
                    alt="confirmar"
                    className="confirmBtn"
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
          <div className='sectorHeader'>
            <h2 className="sectorTitle">Deletar?</h2>
            <div className='sectorEdit'>
              <Image className='cancel' src={Cancel} alt='Cancel' onClick={() => setDel(false)} />
              <Image className='trueTrash' src={Trash} alt='Trash' />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
