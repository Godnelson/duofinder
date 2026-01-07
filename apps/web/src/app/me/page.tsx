'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type MeProfile = {
  userId: string;
  bio: string | null;
  server: string;
  rankTier: string;
  rankDivision: string | null;
  lp: number;
  primaryRole: string;
  secondaryRole: string | null;
  nickname: string;
  isMono: boolean;
  mainChampionId: number | null;
};

export default function MePage() {
  const [data, setData] = useState<MeProfile | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    const p = await api<MeProfile>('/me/profile');
    setData(p);
  }

  useEffect(() => {
    load().catch(e => setErr(String(e.message || e)));
  }, []);

  async function save() {
    if (!data) return;
    setErr(null);
    const p = await api<MeProfile>('/me/profile', {
      method: 'PUT',
      body: JSON.stringify({
        bio: data.bio,
        nickname: data.nickname,
        primaryRole: data.primaryRole,
        secondaryRole: data.secondaryRole,
        rankTier: data.rankTier,
        rankDivision: data.rankDivision,
        lp: data.lp,
        server: data.server,
      }),
    });
    setData(p);
  }

  if (err) return <main style={{ padding: 24 }}><p style={{ color: 'red' }}>{err}</p></main>;
  if (!data) return <main style={{ padding: 24 }}>Carregando...</main>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Meu perfil</h1>
      <p><a href="/discover">Voltar</a></p>

      <div style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
        <label>Nickname (só liberado no match)
          <input value={data.nickname} onChange={(e) => setData({ ...data, nickname: e.target.value })} />
        </label>
        <label>Bio
          <textarea value={data.bio ?? ''} onChange={(e) => setData({ ...data, bio: e.target.value })} />
        </label>
        <label>Role primária
          <input value={data.primaryRole} onChange={(e) => setData({ ...data, primaryRole: e.target.value })} />
        </label>
        <label>Role secundária
          <input value={data.secondaryRole ?? ''} onChange={(e) => setData({ ...data, secondaryRole: e.target.value || null })} />
        </label>
        <label>Elo (tier)
          <input value={data.rankTier} onChange={(e) => setData({ ...data, rankTier: e.target.value })} />
        </label>
        <label>Divisão
          <input value={data.rankDivision ?? ''} onChange={(e) => setData({ ...data, rankDivision: e.target.value || null })} />
        </label>
        <label>LP
          <input type="number" value={data.lp} onChange={(e) => setData({ ...data, lp: Number(e.target.value) })} />
        </label>
        <button onClick={save}>Salvar</button>
      </div>
    </main>
  );
}
