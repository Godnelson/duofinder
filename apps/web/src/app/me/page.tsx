'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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

  const completion = useMemo(() => {
    if (!data) return 0;
    const fields = [data.nickname, data.bio, data.primaryRole, data.rankTier, data.server];
    const filled = fields.filter(value => value && String(value).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [data]);

  return (
    <PageLayout
      title="Meu perfil"
      subtitle="Atualize suas informações para receber matches melhores."
      kicker="Seu perfil"
      navLinks={navLinks}
      activeHref="/me"
      actions={
        <Link href="/discover">
          <Button variant="secondary">Voltar ao feed</Button>
        </Link>
      }
    >
      {err && (
        <Alert variant="destructive">
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}
      {loading && (
        <Alert>
          <AlertDescription>Carregando perfil...</AlertDescription>
        </Alert>
      )}

      {!loading && data && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <CardTitle>Resumo do perfil</CardTitle>
              <CardDescription>Esses dados aparecem no discover.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Servidor</p>
                  <p className="mt-2 text-lg font-semibold">{data.server}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Elo</p>
                  <p className="mt-2 text-lg font-semibold">
                    {data.rankTier} {data.rankDivision ?? ''}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">LP</p>
                  <p className="mt-2 text-lg font-semibold">{data.lp}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Roles</p>
                  <p className="mt-2 text-lg font-semibold">
                    {data.primaryRole} / {data.secondaryRole ?? '—'}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Badge variant="accent">Perfil completo: {completion}%</Badge>
                <Link href="/discover">
                  <Button variant="ghost">Ver como aparece</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/70">
            <CardHeader className="gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle>Editar dados</CardTitle>
                  <CardDescription>Salve para atualizar o feed.</CardDescription>
                </div>
                <Button onClick={save} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Nickname (liberado após o match)
                  <Input
                    value={data.nickname}
                    onChange={event => setData({ ...data, nickname: event.target.value })}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Servidor
                  <Input
                    value={data.server}
                    onChange={event => setData({ ...data, server: event.target.value })}
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm font-medium text-muted-foreground">
                Bio
                <Textarea
                  value={data.bio ?? ''}
                  onChange={event => setData({ ...data, bio: event.target.value })}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Role primária
                  <Input
                    value={data.primaryRole}
                    onChange={event => setData({ ...data, primaryRole: event.target.value })}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Role secundária
                  <Input
                    value={data.secondaryRole ?? ''}
                    onChange={event =>
                      setData({ ...data, secondaryRole: event.target.value || null })
                    }
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Tier
                  <Input
                    value={data.rankTier}
                    onChange={event => setData({ ...data, rankTier: event.target.value })}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Divisão
                  <Input
                    value={data.rankDivision ?? ''}
                    onChange={event =>
                      setData({ ...data, rankDivision: event.target.value || null })
                    }
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  LP
                  <Input
                    type="number"
                    value={data.lp}
                    onChange={event => setData({ ...data, lp: Number(event.target.value) })}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
