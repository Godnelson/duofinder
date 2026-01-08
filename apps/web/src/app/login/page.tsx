'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/discover', label: 'Discover' },
  { href: '/likes', label: 'Likes' },
  { href: '/matches', label: 'Matches' },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const { accessToken } = await api<{ accessToken: string }>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('accessToken', accessToken);
      document.cookie = `accessToken=${accessToken}; Path=/; SameSite=Lax`;
      router.push('/discover');
    } catch (error) {
      setErr(String((error as Error).message || error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout
      title={mode === 'login' ? 'Login' : 'Criar conta'}
      subtitle="Acesse sua conta para continuar no DuoFinder."
      kicker="Acesso"
      navLinks={navLinks}
      activeHref="/login"
      actions={
        <Link href="/">
          <Button variant="secondary">Voltar</Button>
        </Link>
      }
    >
      <section className="section" style={{ maxWidth: 520 }}>
        <Card>
          <div className="row">
            <Button variant={mode === 'login' ? 'primary' : 'secondary'} onClick={() => setMode('login')}>
              Login
            </Button>
            <Button
              variant={mode === 'register' ? 'primary' : 'secondary'}
              onClick={() => setMode('register')}
            >
              Criar conta
            </Button>
          </div>

          <p className="muted">
            {mode === 'login'
              ? 'Use seu email e senha para acessar o feed.'
              : 'Crie sua conta para começar a buscar duos.'}
          </p>

          <form onSubmit={submit} className="split">
            <Input
              label="Email"
              placeholder="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              type="email"
              required
            />
            <Input
              label="Senha"
              placeholder="senha (min 6)"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : mode === 'login' ? 'Entrar' : 'Criar'}
            </Button>
          </form>

          {err && <div className="alert alert--error">{err}</div>}
        </Card>
      </section>
    </PageLayout>
  );
}
