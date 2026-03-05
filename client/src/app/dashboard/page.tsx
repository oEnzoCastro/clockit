import React from 'react'
import './dashboard.css'
import { redirect } from 'next/navigation'


export default async function page() {

  redirect('/dashboard/areas')

  return (
    <></>
  );
} 
