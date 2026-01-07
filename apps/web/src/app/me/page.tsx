'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input, Textarea } from '@/components/Input';
import { PageLayout } from '@/components/Layout';

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

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/discover', label: 'Discover' },
  { href: '/likes', label: 'Likes' },
  { href: '/matches', label: 'Matches' },
];

export default function MePage() {
  const [data, setData] = useState<MeProfile | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const profile = await api<MeProfile>('/me/profile');
      setData(profile);
    } catch (error) {
      setErr(String((error as Error).message || error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!data) return;
    setErr(null);
    setSaving(true);
    try {
      const profile = await api<MeProfile>('/me/profile', {
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
      setData(profile);
    } catch (error) {
      setErr(String((error as Error).message || error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageLayout
      title="Meu perfil"
      subtitle="Atualize suas informações para receber matches melhores."
      navLinks={navLinks}
      actions={
        <Link href="/discover">
          <Button variant="secondary">Voltar ao feed</Button>
        </Link>
      }
    >
      {err && <div className="alert alert--error">{err}</div>}
      {loading && <div className="alert">Carregando perfil...</div>}

      {!loading && data && (
        <section className="section">
          <div className="split">
            <Card>
              <h2 className="card__title">Resumo do perfil</h2>
              <p className="muted">Esses dados aparecem no discover.</p>
              <div className="stats">
                <div className="stat">
                  <p className="stat__label">Servidor</p>
                  <p className="stat__value">{data.server}</p>
                </div>
                <div className="stat">
                  <p className="stat__label">Elo</p>
                  <p className="stat__value">
                    {data.rankTier} {data.rankDivision ?? ''}
                  </p>
                </div>
                <div className="stat">
                  <p className="stat__label">LP</p>
                  <p className="stat__value">{data.lp}</p>
                </div>
                <div className="stat">
                  <p className="stat__label">Roles</p>
                  <p className="stat__value">
                    {data.primaryRole} / {data.secondaryRole ?? '—'}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="card__title">Editar dados</h2>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <p className="muted">Salve para atualizar o feed.</p>
                <Button onClick={save} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
              <div className="split">
                <Input
                  label="Nickname (liberado após o match)"
                  value={data.nickname}
                  onChange={event => setData({ ...data, nickname: event.target.value })}
                />
                <Input
                  label="Servidor"
                  value={data.server}
                  onChange={event => setData({ ...data, server: event.target.value })}
                />
              </div>
              <Textarea
                label="Bio"
                value={data.bio ?? ''}
                onChange={event => setData({ ...data, bio: event.target.value })}
              />
              <div className="split">
                <Input
                  label="Role primária"
                  value={data.primaryRole}
                  onChange={event => setData({ ...data, primaryRole: event.target.value })}
                />
                <Input
                  label="Role secundária"
                  value={data.secondaryRole ?? ''}
                  onChange={event =>
                    setData({ ...data, secondaryRole: event.target.value || null })
                  }
                />
              </div>
              <div className="split">
                <Input
                  label="Tier"
                  value={data.rankTier}
                  onChange={event => setData({ ...data, rankTier: event.target.value })}
                />
                <Input
                  label="Divisão"
                  value={data.rankDivision ?? ''}
                  onChange={event =>
                    setData({ ...data, rankDivision: event.target.value || null })
                  }
                />
                <Input
                  label="LP"
                  type="number"
                  value={data.lp}
                  onChange={event => setData({ ...data, lp: Number(event.target.value) })}
                />
              </div>
            </Card>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
