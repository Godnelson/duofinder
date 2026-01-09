'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { PublicProfile } from '@duo/shared';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/discover', label: 'Discover' },
  { href: '/matches', label: 'Matches' },
  { href: '/me', label: 'Meu perfil' },
];

export default function LikesPage() {
  const [items, setItems] = useState<PublicProfile[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<PublicProfile[]>('/likes/received')
      .then(setItems)
      .catch(error => setErr(String((error as Error).message || error)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title="Likes recebidos"
      subtitle="Perfis que curtiram você recentemente."
      kicker="Engajamento"
      navLinks={navLinks}
      activeHref="/likes"
      actions={
        <Link href="/discover">
          <Button variant="secondary">Voltar ao feed</Button>
        </Link>
      }
    >
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle>Quem já demonstrou interesse</CardTitle>
          <CardDescription>Dê like de volta para liberar o match.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge>Total: {loading ? '—' : items.length}</Badge>
            <Link href="/matches">
              <Button>Ver matches</Button>
            </Link>
          </div>

          {err && (
            <Alert variant="destructive">
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}
          {loading && (
            <Alert>
              <AlertDescription>Carregando likes...</AlertDescription>
            </Alert>
          )}
          {!loading && !err && items.length === 0 && (
            <Alert variant="outline">
              <AlertDescription>Ainda não há likes por aqui. Continue no discover!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            {items.map(profile => (
              <Card key={profile.userId} className="bg-background/80">
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <CardTitle>{profile.rankTier}</CardTitle>
                      <CardDescription>
                        {profile.primaryRole} / {profile.secondaryRole ?? '—'}
                      </CardDescription>
                    </div>
                    <Badge>LP: {profile.lp}</Badge>
                  </div>
                  <p className="text-sm text-foreground">
                    {profile.bio ?? 'Sem bio disponível.'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.length ? (
                      profile.tags.map(tag => <Badge key={tag.id}>{tag.name}</Badge>)
                    ) : (
                      <span className="text-sm text-muted-foreground">Sem tags cadastradas.</span>
                    )}
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
