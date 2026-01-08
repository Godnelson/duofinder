'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { MatchRow } from '@duo/shared';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/discover', label: 'Discover' },
  { href: '/likes', label: 'Likes' },
  { href: '/me', label: 'Meu perfil' },
];

export default function MatchesPage() {
  const [items, setItems] = useState<MatchRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<MatchRow[]>('/matches')
      .then(setItems)
      .catch(error => setErr(String((error as Error).message || error)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title="Matches"
      subtitle="Conexões desbloqueadas quando o like é mútuo."
      navLinks={navLinks}
      actions={
        <Link href="/discover">
          <Button variant="secondary">Explorar feed</Button>
        </Link>
      }
    >
      <section className="section">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2 className="card__title">Seus matches</h2>
            <p className="muted">Abra cada match para ver o nick liberado.</p>
          </div>
        </div>

        {err && <div className="alert alert--error">{err}</div>}
        {loading && <div className="alert">Carregando matches...</div>}
        {!loading && !err && items.length === 0 && (
          <div className="alert alert--empty">Ainda não há matches. Continue no discover!</div>
        )}

        <div className="card-grid">
          {items.map(match => (
            <Card key={match.id}>
              <h3 className="card__title">Match {match.id.slice(0, 8)}</h3>
              <p className="muted">
                Criado em{' '}
                {new Date(match.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <Link href={`/matches/${match.id}`}>
                <Button variant="ghost">Ver detalhes</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
