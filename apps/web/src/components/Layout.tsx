import type { ReactNode } from 'react';
import Link from 'next/link';

export type NavLink = {
  href: string;
  label: string;
};

type PageLayoutProps = {
  title: string;
  subtitle?: string;
  navLinks?: NavLink[];
  children: ReactNode;
  actions?: ReactNode;
};

export function PageLayout({ title, subtitle, navLinks, children, actions }: PageLayoutProps) {
  return (
    <div className="page">
      <header className="page__header">
        <div className="page__header-inner">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <h1 className="page__title">{title}</h1>
              {subtitle && <p className="page__subtitle">{subtitle}</p>}
            </div>
            {actions}
          </div>
          {navLinks && (
            <nav className="page__nav">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main className="page__content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
