'use client'
import { useState } from 'react'
import { useProtectedPage } from '@/hooks/useProtectedPage';
import { useAuth } from '@/contexts/AuthContext'
import './agentes.css'
import Image from 'next/image'

import Sidebar from '../../../components/Sidebar/Sidebar'

export default function page() {
  const { checking } = useProtectedPage(['manager']); // <-- aqui define a role
  const { accessToken } = useAuth()

  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sectorName, setSectorName] = useState('')
  const [acronym, setAcronym] = useState('')
  const [isHidden, setIsHidden] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accessToken) {
      alert('Sessão expirada. Faça login novamente.')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({

        }),
      })

      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch { }

      if (!res.ok) {
        alert(data?.message || data?.error || 'Erro ao criar matéria')
        return
      }

    } catch (err) {
      console.error(err)
      alert('Erro ao criar matéria')
    }
  }

  if (checking) return <div>Carregando...</div>;
  return (
    <main>
      <Sidebar />
      <section className='mainContent'>
        <article className='mainHeader'>
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
            <h2>Novo monitor</h2>
          </button>
          <h2 className='title'>Monitores</h2>
        </article>
        <article className='agentes'>
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
  );
} 
