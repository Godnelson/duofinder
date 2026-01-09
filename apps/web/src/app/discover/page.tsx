'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { PublicProfile } from '@duo/shared';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle>Seu feed personalizado</CardTitle>
          <CardDescription>
            Use o filtro padrão do servidor BR para achar perfis compatíveis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map(card => (
              <div
                key={card.label}
                className="rounded-xl border border-border/60 bg-background/70 px-4 py-3"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-2 text-lg font-semibold">{card.value}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Curta para liberar o match. Dislike remove do seu feed.
            </p>
            <Link href="/likes">
              <Button variant="secondary">Ver likes</Button>
            </Link>
          </div>

          {err && (
            <Alert variant="destructive">
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}
          {loading && (
            <Alert>
              <AlertDescription>Carregando perfis...</AlertDescription>
            </Alert>
          )}
          {!loading && !err && items.length === 0 && (
            <Alert variant="outline">
              <AlertDescription>
                Nenhum perfil encontrado. Tente recarregar em alguns minutos.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            {items.map(profile => (
              <Card key={profile.userId} className="bg-background/80">
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <CardTitle>
                        {profile.rankTier} {profile.rankDivision ?? ''}
                      </CardTitle>
                      <CardDescription>
                        {profile.primaryRole} / {profile.secondaryRole ?? '—'}
                      </CardDescription>
                    </div>
                    <Badge>LP: {profile.lp}</Badge>
                  </div>
                  <p className="text-sm text-foreground">{profile.bio ?? 'Sem bio ainda.'}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.tags.length ? (
                        profile.tags.map(tag => <Badge key={tag.id}>{tag.name}</Badge>)
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Nenhuma tag cadastrada.
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Campeões
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.champions.length ? (
                        profile.champions.map(champion => (
                          <Badge key={champion.id}>{champion.name}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Nenhum campeão favorito.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={() => swipe(profile.userId, 'DISLIKE')}>
                      Dislike
                    </Button>
                    <Button onClick={() => swipe(profile.userId, 'LIKE')}>Like</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
