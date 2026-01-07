'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { MatchDetail } from '@duo/shared';

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<MatchDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<MatchDetail>(`/matches/${params.id}`).then(setData).catch(e => setErr(String(e.message || e)));
  }, [params.id]);

  if (err) return <main style={{ padding: 24 }}><p style={{ color: 'red' }}>{err}</p></main>;
  if (!data) return <main style={{ padding: 24 }}>Carregando...</main>;

  return (
    <main style={{ padding: 24 }}>
      <p><a href="/matches">Voltar</a></p>
      <h1>Match</h1>
      <p><b>Nick liberado:</b> {data.other.nickname}</p>
      <p><b>{data.other.rankTier}</b> • {data.other.primaryRole}</p>
      <p>{data.other.bio ?? ''}</p>
    </main>
  );
}
