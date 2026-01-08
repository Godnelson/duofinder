import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageLayout } from '@/components/Layout';

const navLinks = [
  { href: '/login', label: 'Login' },
  { href: '/discover', label: 'Discover' },
  { href: '/likes', label: 'Likes' },
  { href: '/matches', label: 'Matches' },
  { href: '/me', label: 'Meu perfil' },
];

export default function Home() {
  return (
    <PageLayout
      title="DuoFinder"
      subtitle="Encontre parceiros de duo com preferências e estilo de jogo alinhados ao seu."
      navLinks={navLinks}
      actions={
        <Link href="/login">
          <Button>Entrar</Button>
        </Link>
      }
    >
      <section className="section">
        <div className="split">
          <div>
            <h2 className="card__title">Matchmaking focado em sinergia</h2>
            <p className="muted">
              O DuoFinder combina perfil, elo, roles e campeões para aproximar pessoas com objetivos parecidos.
            </p>
            <div className="row">
              <Link href="/discover">
                <Button>Explorar feed</Button>
              </Link>
              <Link href="/me">
                <Button variant="secondary">Atualizar perfil</Button>
              </Link>
            </div>
          </div>
          <div className="card-grid">
            <Card>
              <h3 className="card__title">Perfis detalhados</h3>
              <p className="muted">Ranks, roles, tags e campeões favoritos em um só lugar.</p>
            </Card>
            <Card>
              <h3 className="card__title">Likes inteligentes</h3>
              <p className="muted">Só revela o nick quando o match acontece.</p>
            </Card>
            <Card>
              <h3 className="card__title">Converse rápido</h3>
              <p className="muted">Acesse suas conexões em uma lista enxuta.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section section--compact">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h3 className="card__title">Comece em poucos minutos</h3>
            <p className="muted">Edite seu perfil e acompanhe o feed em tempo real.</p>
          </div>
          <Link href="/discover">
            <Button variant="ghost">Ver feed</Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
