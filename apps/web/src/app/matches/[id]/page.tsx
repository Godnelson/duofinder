'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { MatchDetail } from '@duo/shared';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      kicker="Conexões"
      navLinks={navLinks}
      activeHref="/matches"
      actions={
        <Link href="/matches">
          <Button variant="secondary">Voltar</Button>
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
          <AlertDescription>Carregando match...</AlertDescription>
        </Alert>
      )}

      {!loading && data && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <Badge variant="accent" className="w-fit">
                Nick liberado
              </Badge>
              <CardTitle className="text-2xl">{data.other.nickname}</CardTitle>
              <CardDescription>{data.other.bio ?? 'Sem bio cadastrada.'}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Elo</p>
                <p className="mt-2 text-lg font-semibold">
                  {data.other.rankTier} {data.other.rankDivision ?? ''}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Roles</p>
                <p className="mt-2 text-lg font-semibold">
                  {data.other.primaryRole} / {data.other.secondaryRole ?? '—'}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">LP</p>
                <p className="mt-2 text-lg font-semibold">{data.other.lp}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/80">
            <CardHeader>
              <CardTitle>Próximos passos</CardTitle>
              <CardDescription>
                Combine um horário com seu duo e mantenha o perfil atualizado para novos matches.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href="/discover">
                <Button variant="ghost">Voltar ao feed</Button>
              </Link>
              <Link href="/me">
                <Button variant="secondary">Editar perfil</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
