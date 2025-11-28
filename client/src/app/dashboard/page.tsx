import React from 'react'
import './style.css'

import fotoArea from '../../../public/Organization-Team-Work 1.png'
import Sidebar from '@/components/Sidebar/Sidebar'
import Area from '@/components/Area/Area'
import Link from 'next/link'

export default async function page() {

  return (
    <main>
      <Sidebar />
      <section className='mainContent'>
        <article className='mainHeader'>
          <h2 className='title'>Minhas areas</h2>
        </article>
        <article className='areas'>
          <Link className='linkArea' href="/dashboard/area"> <Area text="Area 1" src={fotoArea} alt="fotoArea" /> </Link>
          <Link className='linkArea' href="/dashboard/area"> <Area text="Area 1" src={fotoArea} alt="fotoArea" /> </Link>
          <Link className='linkArea' href="/dashboard/area"> <Area text="Area 1" src={fotoArea} alt="fotoArea" /> </Link>
        </article>
      </section>
    </main>
  );
} 
