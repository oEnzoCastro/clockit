'use client';

import styles from './style.module.css';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../../public/clockit.svg';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instituteAcronym, setInstituteAcronym] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (accessToken) router.replace('/dashboard');
  }, [accessToken, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          institute_acronym: instituteAcronym,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Erro no login');
        return;
      }

      if (!data?.data?.institute_id) {
        return;
      }

      login(data.data.accessToken, {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        institute_role: data.data.institute_role,
        institute_id: data.data.institute_id,
        area: data.data.area,
      });

      router.replace('/dashboard');
    } catch (err) {
      console.error(err);
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.forms}>
        <form className={styles.form} onSubmit={handleLogin}>
          <Image src={logo} alt="ClockIt" className={styles.logoImg} />

          <div className={styles.inputsContainer}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputs}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputs}
            />
            <input
              type="text"
              placeholder="Sigla do instituto"
              value={instituteAcronym}
              onChange={(e) => setInstituteAcronym(e.target.value.toUpperCase())}
              required
              className={styles.inputs}
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.log}
              disabled={isLoading}
            >
              <span className={styles.btnText}>{isLoading ? 'Entrando...' : 'Login'}</span>
            </button>
          </div>

          {message && <p className={styles.loginMessage}>{message}</p>}
        </form>
      </div>
    </div>
  );
}