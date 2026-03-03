'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import './areas.css'
import { useProtectedPage } from '@/hooks/useProtectedPage';

import Sidebar from '../../../components/Sidebar/Sidebar'
import Area from '../../../components/Area/Area'
import Link from 'next/link'
import Image from 'next/image'

export default function Page() {

  const { checking } = useProtectedPage(['manager']); // <-- aqui define a role

  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const [areas, setAreas] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/areas/get')
      .then(res => res.json())
      .then(json => {
        setAreas(json.data)
      })
      .catch(err => console.error('Erro ao buscar áreas:', err))
  }, [])

  if (checking) return <div>Carregando...</div>;
  return (
    <main>
      <Sidebar />
      <section className='mainContent'>
        <article className='mainHeader'>
          <div className="wrapper">
            {!editing ? (
              <div
                className="newSector animated"
                onClick={() => setEditing(true)}
              >
                <Image src="/plus.svg" alt="Plus" width={24} height={24} />
                <h2>Novo Curso</h2>
              </div>
            ) : (
              <div className="search animated expanded">
                <Image src="/magnifying-glass.svg" alt="Plus" width={24} height={24} />
                <input
                  className="sectorSeach"
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Digite o nome do setor..."
                  onBlur={() => setEditing(false)}
                  autoFocus
                />
              </div>
            )}
          </div>
          <h2 className='title'>Cursos</h2>
        </article>

        <article className='areas'>
          {areas.map((area) => (
            <Link
              key={area.id}
              className='linkArea'
              href={`/dashboard/areas/${area.id}`}
            >
              <Area {...area} />
            </Link>
          ))}
        </article>

      </section>
    </main>
  );
}