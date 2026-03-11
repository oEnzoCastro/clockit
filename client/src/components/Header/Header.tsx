'use client';

import styles from './style.module.css';
import Image from 'next/image';
import logo from '../../../public/user-circle.svg';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) return null;
  if (!user) return null;

  return (
    <header className={styles.header}>
      <section className={`${styles.Logo} ${styles.sec}`}>
        <div className={styles.logo}>
          <Image src={logo} alt="logo" />
        </div>
        <h2 className={styles.blocks}>Clockit</h2>
      </section>

      <section className={`${styles.pages} ${styles.sec}`}>
        <Link className={styles.blocks} href="/calendario">
          <h2 className={styles.blocks}>Calendário</h2>
        </Link>

        <Link className={styles.blocks} href="/dashboard">
          <h2 className={styles.blocks}>Dashboard</h2>
        </Link>
      </section>
    </header>
  );
}