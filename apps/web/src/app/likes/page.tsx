'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { PublicProfile } from '@duo/shared';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/discover', label: 'Discover' },
  { href: '/matches', label: 'Matches' },
  { href: '/me', label: 'Meu perfil' },
];

export default function LikesPage() {
  const [items, setItems] = useState<PublicProfile[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<PublicProfile[]>('/likes/received')
      .then(setItems)
      .catch(error => setErr(String((error as Error).message || error)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title="Likes recebidos"
      subtitle="Perfis que curtiram você recentemente."
      kicker="Engajamento"
      navLinks={navLinks}
      activeHref="/likes"
      actions={
        <Link href="/discover">
          <Button variant="secondary">Voltar ao feed</Button>
        </Link>
      }
    >
      <section className="section">
        <div className="section__header">
          <h2 className="card__title">Quem já demonstrou interesse</h2>
          <p className="muted">Dê like de volta para liberar o match.</p>
        </div>

        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="badge">Total: {loading ? '—' : items.length}</span>
          <Link href="/matches">
            <Button>Ver matches</Button>
          </Link>
        </div>

        {err && <div className="alert alert--error">{err}</div>}
        {loading && <div className="alert">Carregando likes...</div>}
        {!loading && !err && items.length === 0 && (
          <div className="alert alert--empty">Ainda não há likes por aqui. Continue no discover!</div>
        )}

        <div className="card-grid">
          {items.map(profile => (
            <Card key={profile.userId}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h3 className="card__title">{profile.rankTier}</h3>
                  <p className="muted">
                    {profile.primaryRole} / {profile.secondaryRole ?? '—'}
                  </p>
                </div>
                <span className="badge">LP: {profile.lp}</span>
              </div>
              <p>{profile.bio ?? 'Sem bio disponível.'}</p>
              <div className="taglist">
                {profile.tags.length ? (
                  profile.tags.map(tag => (
                    <span key={tag.id} className="badge">
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <span className="muted">Sem tags cadastradas.</span>
                )}
              </div>
              {/* nickname nunca aqui */}
            </Card>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
