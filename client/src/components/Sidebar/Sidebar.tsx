'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './style.module.css'

export default function Sidebar() {
  const pathname = usePathname()

  const isAreas = pathname.startsWith('/dashboard/areas')
  const isAgentes = pathname.startsWith('/dashboard/agentes')

  return (
    <aside
      className={`${styles.sidebar} 
      ${isAreas ? styles.sidebarAreas : ''} 
      ${isAgentes ? styles.sidebarAgentes : ''}
    `}
    >
      <Link
        href="/dashboard/areas"
        className={`${styles.opcoes} ${isAreas ? styles.ativo : ''}`}
      >
        <h2 className={styles.pageName}>Cursos</h2>
      </Link>

      <Link
        href="/dashboard/agentes"
        className={`${styles.opcoes} ${isAgentes ? styles.ativo : ''}`}
      >
        <h2 className={styles.pageName}>Monitores</h2>
      </Link>
    </aside>
  )
}
