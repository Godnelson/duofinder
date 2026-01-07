'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { MatchDetail } from '@duo/shared';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/discover', label: 'Discover' },
  { href: '/likes', label: 'Likes' },
  { href: '/matches', label: 'Matches' },
];

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<MatchDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<MatchDetail>(`/matches/${params.id}`)
      .then(setData)
      .catch(error => setErr(String((error as Error).message || error)))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <PageLayout
      title="Match"
      subtitle="Detalhes do duo liberado."
      navLinks={navLinks}
      actions={
        <Link href="/matches">
          <Button variant="secondary">Voltar</Button>
        </Link>
      }
    >
      {err && <div className="alert alert--error">{err}</div>}
      {loading && <div className="alert">Carregando match...</div>}

      {!loading && data && (
        <section className="section">
          <Card>
            <h2 className="card__title">Nick liberado</h2>
            <p className="muted">{data.other.nickname}</p>
            <div className="stats">
              <div className="stat">
                <p className="stat__label">Elo</p>
                <p className="stat__value">
                  {data.other.rankTier} {data.other.rankDivision ?? ''}
                </p>
              </div>
              <div className="stat">
                <p className="stat__label">Roles</p>
                <p className="stat__value">
                  {data.other.primaryRole} / {data.other.secondaryRole ?? '—'}
                </p>
              </div>
              <div className="stat">
                <p className="stat__label">LP</p>
                <p className="stat__value">{data.other.lp}</p>
              </div>
            </div>
            <p>{data.other.bio ?? 'Sem bio cadastrada.'}</p>
          </Card>
        </section>
      )}
    </PageLayout>
  );
}
