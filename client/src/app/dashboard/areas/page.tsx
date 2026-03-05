'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import './areas.css'
import { useProtectedPage } from '@/hooks/useProtectedPage'
import { useAuth } from '@/contexts/AuthContext'

import Sidebar from '../../../components/Sidebar/Sidebar'
import Area from '../../../components/Area/Area'
import Link from 'next/link'

export default function Page() {
  const { checking } = useProtectedPage(['manager'])
  const { accessToken, user } = useAuth()
  console.log('[AREAS PAGE] token?', !!accessToken, 'user =>', user)

  const [areas, setAreas] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/areas/get')
      .then((res) => res.json())
      .then((json) => setAreas(json.data || []))
      .catch((err) => console.error('Erro ao buscar áreas:', err))
  }, [])

  if (checking) return <div>Carregando...</div>

  return (
    <main>
      <Sidebar />

      <section className="mainContent">
        <article className="mainHeader">
          <h2 className="title">Cursos</h2>
        </article>

        <article className="areas">
          {areas.map((area) => (
            <Link key={area.id} className="linkArea" href={`/dashboard/areas/${area.id}`}>
              <Area {...area} />
            </Link>
          ))}
        </article>
      </section>
    </main>
  )
}