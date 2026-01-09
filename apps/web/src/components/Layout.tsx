import type { ReactNode } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

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
    <div className="min-h-screen">
      <header className="border-b border-border/70 bg-background/60 backdrop-blur">
        <div className="container flex flex-col gap-5 py-10">
          {kicker && (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {kicker}
            </span>
          )}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold lg:text-4xl">{title}</h1>
              {subtitle && <p className="mt-3 max-w-2xl text-base text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
          </div>
          {navLinks && (
            <nav className="flex flex-wrap gap-2">
              {navLinks.map(link => {
                const isActive = activeHref === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm transition-colors',
                      isActive
                        ? 'border-primary/60 bg-primary/10 text-foreground'
                        : 'border-border/70 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground',
                    )}
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
      <main className="container flex flex-1 flex-col gap-6 py-8">{children}</main>
    </div>
  );
}
