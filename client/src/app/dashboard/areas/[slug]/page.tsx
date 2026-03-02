'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import { useParams } from 'next/navigation'
import './style.css'
import Image from 'next/image'
import Link from 'next/link'

import Sidebar from '../../../../components/Sidebar/Sidebar'
import Sector from '../../../../components/Sector/Sector'

export default function Page() {

    const params = useParams()
    const areaId = params.slug as string

    const [areaNome, setAreaNome] = useState('')
    const [sectors, setSectors] = useState<any[]>([])

    useEffect(() => {
        fetch(`http://localhost:5000/areas/${areaId}`)
            .then(res => res.json())
            .then(json => {
                setAreaNome(json.data.area_name)
            })
            .catch(err => console.error('Erro ao buscar área:', err))
    }, [areaId])

    useEffect(() => {
        if (!areaId) return

        fetch(`http://localhost:5000/sectors/get?area_id=${areaId}`)
            .then(res => {
                if (!res.ok) return { data: [] }
                return res.json()
            })
            .then(json => {
                setSectors(json.data || [])
            })
            .catch(err => console.error('Erro ao buscar matérias:', err))

    }, [areaId])

    return (
        <main>
            <Sidebar />
            <section className='mainContent'>
                <article className='mainHeader'>
                    <Link className='arrowBack' href='/dashboard/areas'>
                        <Image src="/arrow-u-up-left.svg" alt="arrow back" width={24} height={24} />
                    </Link>
                    <div className="newSector">
                        <Image src="/plus.svg" alt="Plus" width={24} height={24} />
                        <h2>Nova matéria</h2>
                    </div>

                    <h2 className='titleArea'>
                        {areaNome || 'Carregando...'}
                    </h2>
                </article>

                <article className='setores'>
                    {sectors.length === 0 ? (
                        <p className="emptyMessage">
                            Nenhuma matéria neste curso
                        </p>
                    ) : (
                        sectors.map((sector) => (
                            <Sector key={sector.id} {...sector} />
                        ))
                    )}
                </article>
            </section>
        </main>
    )
}   