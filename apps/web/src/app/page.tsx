'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/login', label: 'Login' },
  { href: '/discover', label: 'Discover' },
  { href: '/likes', label: 'Likes' },
  { href: '/matches', label: 'Matches' },
  { href: '/me', label: 'Meu perfil' },
];

const highlights = [
  {
    title: 'Perfil estratégico',
    description: 'Defina elo, roles e campeões para aparecer no feed certo.',
  },
  {
    title: 'Descoberta rápida',
    description: 'Curta ou descarte perfis em poucos segundos.',
  },
  {
    title: 'Match confirmado',
    description: 'Veja o nick liberado e combine o horário de jogo.',
  },
];

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.replace('/discover');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return null;
  }

  return (
    <PageLayout
      title="DuoFinder"
      subtitle="Encontre parceiros alinhados ao seu estilo de jogo e monte o duo perfeito."
      kicker="Bem-vindo"
      navLinks={navLinks}
      activeHref="/"
      actions={
        <>
          <Link href="/login">
            <Button>Entrar</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Criar conta</Button>
          </Link>
        </>
      }
    >
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-5">
              <Badge variant="accent" className="w-fit">
                Novo fluxo de matches
              </Badge>
              <h2 className="text-2xl font-semibold leading-tight lg:text-3xl">
                Seu duo ideal começa aqui
              </h2>
              <p className="text-muted-foreground">
                Complete seu perfil, descubra jogadores compatíveis e só libere o nick quando o match
                acontecer.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/discover">
                  <Button>Ver funcionalidades</Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost">Acessar conta</Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              {highlights.map((item, index) => (
                <Card key={item.title} className="bg-background/70">
                  <CardHeader className="space-y-3">
                    <Badge variant="accent">Passo {index + 1}</Badge>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Acompanhe o feed</CardTitle>
            <CardDescription>
              Veja novos perfis do servidor BR e use os likes para formar duos mais rápido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/discover">
              <Button variant="secondary">Ir para discover</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Organize seus matches</CardTitle>
            <CardDescription>
              Todos os matches aparecem em uma lista simples com acesso ao nick.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/matches">
              <Button variant="secondary">Ver matches</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
