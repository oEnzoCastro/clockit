'use client'
import { useState } from 'react'
import React from 'react'
import './style.css'
import Image from 'next/image'
import Link from 'next/link'

import Sidebar from '@/components/Sidebar/Sidebar'
import Sector from '@/components/Sector/Sector'

import ArrowBack from '../../../../public/arrow-u-up-left.svg'
import Plus from '../../../../public/plus.svg'
import Seach from '../../../../public/magnifying-glass.svg'

export default function page() {

    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState('')


    return (
        <main>
            <Sidebar />
            <section className='mainContent'>
                <article className='mainHeader'>
                    <Link className='arrowBack' href='../dashboard'> <Image src={ArrowBack} alt='arrow back' /> </Link>
                    <div className="wrapper">
                        {!editing ? (
                            <div
                                className="newSector animated"
                                onClick={() => setEditing(true)}
                            >
                                <Image src={Plus} alt="Plus" width={24} height={24} />
                                <h2>Novo setor</h2>
                            </div>  
                        ) : (
                            <div className="search animated expanded">
                                <Image className="lupe" src={Seach} alt="seach" />
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

                    <h2 className='titleArea'>Area 1</h2>
                </article>

                <article className='setores'>
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                    <Sector />
                </article>
            </section>
        </main>
    )
}
