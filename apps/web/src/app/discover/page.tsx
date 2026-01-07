'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { PublicProfile } from '@duo/shared';

export default function DiscoverPage() {
  const [items, setItems] = useState<PublicProfile[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const data = await api<PublicProfile[]>('/discover/feed?server=BR&take=20');
    setItems(data);
  }

  useEffect(() => {
    load().catch(e => setErr(String(e.message || e)));
  }, []);

  async function swipe(toUserId: string, action: 'LIKE' | 'DISLIKE') {
    setItems(prev => prev.filter(p => p.userId !== toUserId));
    const res = await api<{ matched: boolean }>('/swipes', {
      method: 'POST',
      body: JSON.stringify({ toUserId, action }),
    });
    if (res.matched) alert('MATCH! Agora o nick será liberado em Matches.');
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Discover</h1>

      <div style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
        <button onClick={() => load().catch(e => setErr(String(e.message || e)))}>Recarregar</button>
        <a href="/likes">Likes em mim</a>
        <a href="/matches">Matches</a>
        <a href="/me">Meu perfil</a>
      </div>

      {err && <p style={{ color: 'red' }}>{err}</p>}

      <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        {items.map(p => (
          <div key={p.userId} style={{ border: '1px solid #333', padding: 12, borderRadius: 8 }}>
            <div>
              <b>
                {p.rankTier} {p.rankDivision ?? ''}
              </b>{' '}
              • {p.primaryRole}/{p.secondaryRole ?? '-'}
            </div>
            <p style={{ marginBottom: 8 }}>{p.bio ?? ''}</p>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Tags: {p.tags.map(t => t.name).join(', ') || '—'}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Champs: {p.isMono ? '(mono)' : ''} {p.champions.map(c => c.name).join(', ') || '—'}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={() => swipe(p.userId, 'DISLIKE')}>Dislike</button>
              <button onClick={() => swipe(p.userId, 'LIKE')}>Like</button>
            </div>
            {/* nickname propositalmente não existe aqui */}
          </div>
        ))}
      </div>
    </main>
  );
}
