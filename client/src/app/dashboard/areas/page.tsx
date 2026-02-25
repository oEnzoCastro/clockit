'use client'
import { useState } from 'react'
import React from 'react'
import './style.css'

import Sidebar from '../../../components/Sidebar/Sidebar'
import Area from '../../../components/Area/Area'
import Link from 'next/link'
import Image from 'next/image'

export default function page() {

  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')

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
                <h2>Nova matéria</h2>
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
          <h2 className='title'>Matérias</h2>
        </article>
        <article className='areas'>
          <Link className='linkArea' href="/dashboard/areas/area"> <Area /> </Link>
        </article>
      </section>
    </main>
  );
} 
