'use client';
import './style.css'
import React, { useState } from 'react'

export default function Page() {

    const [mostrarFrom, setMostrarForm] = useState(false)

    return (
        <div className='loginForm '>
            <div className='forms'>

                {/* LOGIN */}
                <section className={`login form ${mostrarFrom ? 'hide' : 'show'}`}>
                    <h1 className='title'>Login</h1>

                    <article className="inputs">
                        <input type="email" placeholder="Email:" />
                        <input type="password" placeholder="Senha:" />
                    </article>

                    <article className="buttons">
                        <button
                            className='cadas red'
                            onClick={() => setMostrarForm(true)}
                        >
                            <h1>Cadastrar</h1>
                        </button>

                        <button className='log'>
                            <h1>Login</h1>
                         </button>
                    </article>
                </section>

                {/* CADASTRO */}
                <section className={`cadastro form ${mostrarFrom ? 'show' : 'hide'}`}>
                    <h1 className='title'>Cadastro</h1>

                    <article className="inputs">
                        <input type="text" placeholder="Nome:" />
                        <input type="email" placeholder="Email:" />
                        <input type="text" placeholder="Instituto:" />
                        <input type="password" placeholder="Senha:" />
                        <input type="password" placeholder="Confirmar senha:" />
                    </article>

                    <article className="buttons">
                        <button className='cadas'>
                            <h1>Cadastrar</h1>
                        </button>

                        <button
                            className='log red'
                            onClick={() => setMostrarForm(false)}
                        >
                            <h1>Login</h1>
                        </button>
                    </article>
                </section>
            </div>


        </div>
    )
}
