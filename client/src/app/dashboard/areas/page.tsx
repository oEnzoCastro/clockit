'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import styles from './style.module.css'
import { useProtectedPage } from '@/hooks/useProtectedPage'
import { useAuth } from '@/contexts/AuthContext'

import Sidebar from '../../../components/Sidebar/Sidebar'
import Area from '../../../components/Area/Area'
import Link from 'next/link'

export default function Page() {
  const { checking } = useProtectedPage(['manager'])
  const { accessToken, user } = useAuth()

  const [areas, setAreas] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/areas/get')
      .then((res) => res.json())
      .then((json) => setAreas(json.data || []))
      .catch((err) => console.error('Erro ao buscar áreas:', err))
  }, [])

  if (checking) return <div>Carregando...</div>

  return (
    <main className={styles.main}>
      <Sidebar />

      <section className={styles.mainContent}>
        <article className={styles.mainHeader}>
          <h2 className={styles.title}>Cursos</h2>
        </article>

        <article className={styles.areas}>
          {areas.map((area) => (
            <Link key={area.id} className={styles.linkArea} href={`/dashboard/areas/${area.id}`}>
              <Area {...area} />
            </Link>
          ))}
        </article>
      </section>
    </main>
  )
}