'use client'
import { useState } from 'react'
import React from 'react'
import './setores_agentes.css'
import Image from 'next/image'
import Link from 'next/link'

import Sidebar from '../../../../components/Sidebar/Sidebar'
import Sector from '../../../../components/Sector/Sector'

export default function page() {

    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState('')


    return (
        <main>
            <Sidebar />
            <section className='mainContent'>
                <article className='mainHeader'>
                    <Link className='arrowBack' href='../areas'> <Image src="/arrow-u-up-left.svg" alt="arrow back" width={24} height={24} />
                    </Link>
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

                    <h2 className='titleArea'>Area 1</h2>
                </article>

                <article className='setores'>
                </article>
            </section>
        </main>
    )
}
