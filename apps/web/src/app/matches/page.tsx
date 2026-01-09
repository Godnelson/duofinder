'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { MatchRow } from '@duo/shared';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/discover', label: 'Discover' },
  { href: '/likes', label: 'Likes' },
  { href: '/me', label: 'Meu perfil' },
];

export default function MatchesPage() {
  const [items, setItems] = useState<MatchRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<MatchRow[]>('/matches')
      .then(setItems)
      .catch(error => setErr(String((error as Error).message || error)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title="Matches"
      subtitle="Conexões desbloqueadas quando o like é mútuo."
      kicker="Conexões"
      navLinks={navLinks}
      activeHref="/matches"
      actions={
        <Link href="/discover">
          <Button variant="secondary">Explorar feed</Button>
        </Link>
      }
    >
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle>Seus matches</CardTitle>
          <CardDescription>Abra cada match para ver o nick liberado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge>Total: {loading ? '—' : items.length}</Badge>
            <Link href="/likes">
              <Button variant="ghost">Ver likes recebidos</Button>
            </Link>
          </div>

          {err && (
            <Alert variant="destructive">
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}
          {loading && (
            <Alert>
              <AlertDescription>Carregando matches...</AlertDescription>
            </Alert>
          )}
          {!loading && !err && items.length === 0 && (
            <Alert variant="outline">
              <AlertDescription>Ainda não há matches. Continue no discover!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map(match => (
              <Card key={match.id} className="bg-background/80">
                <CardHeader className="space-y-2">
                  <CardTitle>Match {match.id.slice(0, 8)}</CardTitle>
                  <CardDescription>
                    Criado em{' '}
                    {new Date(match.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/matches/${match.id}`}>
                    <Button variant="secondary">Ver detalhes</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
