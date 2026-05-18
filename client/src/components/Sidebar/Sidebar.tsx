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
        <span className={styles.pageName}>Cursos</span>
      </Link>

      <Link
        href="/dashboard/agentes"
        className={`${styles.opcoes} ${isAgentes ? styles.ativo : ''}`}
      >
        <span className={styles.pageName}>Monitores</span>
      </Link>
    </aside>
  )
}