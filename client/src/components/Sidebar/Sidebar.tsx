'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './style.css'

export default function Sidebar() {
  const pathname = usePathname()

  const isAreas = pathname.startsWith('/dashboard/areas')
  const isAgentes = pathname.startsWith('/dashboard/agentes')

  return (
    <aside
      className={`sidebar 
        ${isAreas ? 'sidebar-areas' : ''} 
        ${isAgentes ? 'sidebar-agentes' : ''}
      `}
    >
      <Link
        href="/dashboard/areas"
        className={`opcoes ${isAreas ? 'ativo' : ''}`}
      >
        <h1 className='pageName'>Matérias</h1>
      </Link>

      <Link
        href="/dashboard/agentes"
        className={`opcoes ${isAgentes ? 'ativo' : ''}`}
      >
        <h1 className='pageName'>Monitores  </h1>
      </Link>
    </aside>
  )
}
