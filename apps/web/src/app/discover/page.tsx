'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { PublicProfile } from '@duo/shared';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/likes', label: 'Likes' },
  { href: '/matches', label: 'Matches' },
  { href: '/me', label: 'Meu perfil' },
];

export default function DiscoverPage() {
  const [items, setItems] = useState<PublicProfile[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const data = await api<PublicProfile[]>('/discover/feed?server=BR&take=20');
      setItems(data);
    } catch (error) {
      setErr(String((error as Error).message || error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function swipe(toUserId: string, action: 'LIKE' | 'DISLIKE') {
    setItems(prev => prev.filter(p => p.userId !== toUserId));
    const res = await api<{ matched: boolean }>('/swipes', {
      method: 'POST',
      body: JSON.stringify({ toUserId, action }),
    });
    if (res.matched) alert('MATCH! Agora o nick será liberado em Matches.');
  }

  const cards = useMemo(
    () => [
      { label: 'Perfis disponíveis', value: loading ? '—' : String(items.length) },
      { label: 'Servidor', value: 'BR' },
      { label: 'Última atualização', value: loading ? '—' : 'Agora' },
    ],
    [items.length, loading],
  );

  return (
    <PageLayout
      title="Discover"
      subtitle="Explore novos perfis e deslize para encontrar seu duo ideal."
      kicker="Feed principal"
      navLinks={navLinks}
      activeHref="/discover"
      actions={<Button onClick={load}>Recarregar</Button>}
    >
      <section className="section">
        <div className="section__header">
          <h2 className="card__title">Seu feed personalizado</h2>
          <p className="muted">Use o filtro padrão do servidor BR para achar perfis compatíveis.</p>
        </div>

        <div className="stats">
          {cards.map(card => (
            <div key={card.label} className="stat">
              <p className="stat__label">{card.label}</p>
              <p className="stat__value">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="divider" />

        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <p className="muted">Curta para liberar o match. Dislike remove do seu feed.</p>
          </div>
          <Link href="/likes">
            <Button variant="secondary">Ver likes</Button>
          </Link>
        </div>

        {err && <div className="alert alert--error">{err}</div>}
        {loading && <div className="alert">Carregando perfis...</div>}
        {!loading && !err && items.length === 0 && (
          <div className="alert alert--empty">Nenhum perfil encontrado. Tente recarregar em alguns minutos.</div>
        )}

        <div className="card-grid">
          {items.map(profile => (
            <Card key={profile.userId}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h3 className="card__title">
                    {profile.rankTier} {profile.rankDivision ?? ''}
                  </h3>
                  <p className="muted">
                    {profile.primaryRole} / {profile.secondaryRole ?? '—'}
                  </p>
                </div>
                <span className="badge">LP: {profile.lp}</span>
              </div>

              <p>{profile.bio ?? 'Sem bio ainda.'}</p>

              <div>
                <p className="field__label">Tags</p>
                <div className="taglist">
                  {profile.tags.length ? (
                    profile.tags.map(tag => (
                      <span key={tag.id} className="badge">
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="muted">Nenhuma tag cadastrada.</span>
                  )}
                </div>
              </div>

              <div>
                <p className="field__label">Campeões</p>
                <div className="taglist">
                  {profile.champions.length ? (
                    profile.champions.map(champion => (
                      <span key={champion.id} className="badge">
                        {champion.name}
                      </span>
                    ))
                  ) : (
                    <span className="muted">Nenhum campeão favorito.</span>
                  )}
                </div>
              </div>

              <div className="row">
                <Button variant="secondary" onClick={() => swipe(profile.userId, 'DISLIKE')}>
                  Dislike
                </Button>
                <Button onClick={() => swipe(profile.userId, 'LIKE')}>Like</Button>
              </div>
              {/* nickname propositalmente não existe aqui */}
            </Card>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
