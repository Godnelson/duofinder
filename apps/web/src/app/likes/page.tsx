'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { PublicProfile } from '@duo/shared';

export default function LikesPage() {
  const [items, setItems] = useState<PublicProfile[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<PublicProfile[]>('/likes/received').then(setItems).catch(e => setErr(String(e.message || e)));
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Quem deu like em mim</h1>
      <p><a href="/discover">Voltar</a></p>
      {err && <p style={{ color: 'red' }}>{err}</p>}

      <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        {items.map(p => (
          <div key={p.userId} style={{ border: '1px solid #333', padding: 12, borderRadius: 8 }}>
            <div>
              <b>{p.rankTier}</b> • {p.primaryRole}
            </div>
            <p>{p.bio ?? ''}</p>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Tags: {p.tags.map(t => t.name).join(', ') || '—'}
            </div>
            {/* nickname nunca aqui */}
          </div>
        ))}
      </div>
    </main>
  );
}
