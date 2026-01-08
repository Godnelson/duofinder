import type { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'DuoFinder',
  description: 'Encontre duos no LoL',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
