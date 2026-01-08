'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/login', label: 'Login' },
  { href: '/discover', label: 'Discover' },
  { href: '/likes', label: 'Likes' },
  { href: '/matches', label: 'Matches' },
  { href: '/me', label: 'Meu perfil' },
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
      <section className="section">
        <div className="split">
          <div>
            <h2 className="card__title">Seu duo ideal começa aqui</h2>
            <p className="muted">
              Complete seu perfil, descubra jogadores compatíveis e só libere o nick quando o match acontecer.
            </p>
            <div className="row">
              <Link href="/discover">
                <Button>Ver funcionalidades</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Acessar conta</Button>
              </Link>
            </div>
          </div>
          <div className="card-grid">
            <Card className="card--soft">
              <span className="badge badge--accent">Passo 1</span>
              <h3 className="card__title">Perfil estratégico</h3>
              <p className="card__description">
                Defina elo, roles, bio e campeões para aparecer no feed certo.
              </p>
            </Card>
            <Card className="card--soft">
              <span className="badge badge--accent">Passo 2</span>
              <h3 className="card__title">Descoberta rápida</h3>
              <p className="card__description">Curta ou descarte perfis em poucos segundos.</p>
            </Card>
            <Card className="card--soft">
              <span className="badge badge--accent">Passo 3</span>
              <h3 className="card__title">Match confirmado</h3>
              <p className="card__description">Veja o nick liberado e combine o horário de jogo.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section section--compact">
        <div className="grid-2">
          <Card>
            <h3 className="card__title">Acompanhe o feed</h3>
            <p className="card__description">
              Veja novos perfis do servidor BR e use os likes para formar duos mais rápido.
            </p>
            <Link href="/discover">
              <Button variant="secondary">Ir para discover</Button>
            </Link>
          </Card>
          <Card>
            <h3 className="card__title">Organize seus matches</h3>
            <p className="card__description">
              Todos os matches aparecem em uma lista simples com acesso ao nick.
            </p>
            <Link href="/matches">
              <Button variant="secondary">Ver matches</Button>
            </Link>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
