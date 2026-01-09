'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
      <Card className="mx-auto w-full max-w-xl border-border/60 bg-card/70">
        <CardHeader>
          <div className="flex flex-wrap gap-3">
            <Button variant={mode === 'login' ? 'default' : 'secondary'} onClick={() => setMode('login')}>
              Login
            </Button>
            <Button
              variant={mode === 'register' ? 'default' : 'secondary'}
              onClick={() => setMode('register')}
            >
              Criar conta
            </Button>
          </div>
          <CardTitle className="text-2xl">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Use seu email e senha para acessar o feed.'
              : 'Crie sua conta para começar a buscar duos.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={submit} className="space-y-4">
            <label className="space-y-2 text-sm font-medium text-muted-foreground">
              Email
              <Input
                placeholder="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                type="email"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-muted-foreground">
              Senha
              <Input
                placeholder="senha (min 6)"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
              />
            </label>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Enviando...' : mode === 'login' ? 'Entrar' : 'Criar'}
            </Button>
          </form>

          {err && (
            <Alert variant="destructive">
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
