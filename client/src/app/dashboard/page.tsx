import React from 'react'
import './dashboard.css'

import fotoArea from '../../../public/Organization-Team-Work 1.png'
import Sidebar from '@/components/Sidebar/Sidebar'
import Area from '@/components/Area/Area'
import Link from 'next/link'
import { redirect } from 'next/navigation'


export default async function page() {

  redirect('/dashboard/areas')

  return (
    <></>
  );
} 
