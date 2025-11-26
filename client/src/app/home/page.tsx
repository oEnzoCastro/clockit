import React from 'react'
import './style.css'

import Header from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'

export default function page() {
    return (
        <section className='home'>
            <Header />
            <main>
                <Sidebar />
            </main>
        </section>
    )
}
