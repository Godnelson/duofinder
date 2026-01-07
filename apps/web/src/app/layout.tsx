import type { ReactNode } from 'react';

export const metadata = {
  title: 'DuoFinder',
  description: 'Encontre duos no LoL',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
