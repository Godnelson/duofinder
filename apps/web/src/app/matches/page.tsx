'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { MatchRow } from '@duo/shared';

export default function MatchesPage() {
  const [items, setItems] = useState<MatchRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<MatchRow[]>('/matches').then(setItems).catch(e => setErr(String(e.message || e)));
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Matches</h1>
      <p><a href="/discover">Voltar</a></p>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <ul>
        {items.map(m => (
          <li key={m.id}>
            <a href={`/matches/${m.id}`}>Match {m.id.slice(0, 8)}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
