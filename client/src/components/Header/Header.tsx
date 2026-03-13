'use client';

import { useState } from 'react';
import styles from './style.module.css';
import Image from 'next/image';
import logo from '../../../public/clockit.svg';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, isAuthReady } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  if (!isAuthReady) return null;
  if (!user) return null;

  function toggleMenu() {
    setMenuAberto((prev) => !prev);
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <>
      {menuAberto && (
        <div className={styles.overlayMenu} onClick={fecharMenu}></div>
      )}

      <header className={styles.header}>
        <section className={styles.sec}>
          <article className={styles.logo}>
            <Image src={logo} alt="logo" className={styles.logoImg} />
          </article>
        </section>

        <button
          className={styles.hamburguer}
          onClick={toggleMenu}
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <section
          className={`${styles.pages} ${styles.sec} ${
            menuAberto ? styles.pagesAbertas : ''
          }`}
        >
          <Link className={styles.blocks} href="/calendario" onClick={fecharMenu}>
            <h2 className={styles.page}>Calendário</h2>
          </Link>

          <Link className={styles.blocks} href="/dashboard" onClick={fecharMenu}>
            <h2 className={styles.page}>Dashboard</h2>
          </Link>
        </section>
      </header>
    </>
  );
}