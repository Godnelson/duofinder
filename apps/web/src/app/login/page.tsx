'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const r = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const { accessToken } = await api<{ accessToken: string }>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('accessToken', accessToken);
    r.push('/discover');
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>{mode === 'login' ? 'Login' : 'Criar conta'}</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode('login')} disabled={mode === 'login'}>
          Login
        </button>
        <button onClick={() => setMode('register')} disabled={mode === 'register'}>
          Register
        </button>
      </div>

      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input
          placeholder="senha (min 6)"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">{mode === 'login' ? 'Entrar' : 'Criar'}</button>
      </form>

      {err && <p style={{ color: 'red' }}>{err}</p>}

      <p style={{ marginTop: 12 }}>
        <a href="/">Home</a>
      </p>
    </main>
  );
}
