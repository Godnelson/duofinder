import type { ReactNode } from 'react';
import Link from 'next/link';

type NavLink = {
  href: string;
  label: string;
};

type PageLayoutProps = {
  title: string;
  subtitle?: string;
  navLinks?: NavLink[];
  children: ReactNode;
  actions?: ReactNode;
  activeHref?: string;
  kicker?: string;
};

export function PageLayout({
  title,
  subtitle,
  navLinks,
  children,
  actions,
  activeHref,
  kicker,
}: PageLayoutProps) {
  return (
    <div className="page">
      <header className="page__header">
        <div className="page__header-inner">
          {kicker && <span className="kicker">{kicker}</span>}
          <div className="page__header-row">
            <div>
              <h1 className="page__title">{title}</h1>
              {subtitle && <p className="page__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page__actions">{actions}</div>}
          </div>
          {navLinks && (
            <nav className="page__nav">
              {navLinks.map(link => {
                const isActive = activeHref === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`page__nav-link${isActive ? ' page__nav-link--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
