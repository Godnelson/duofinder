import type { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'DuoFinder',
  description: 'Encontre duos no LoL',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        <div className="min-h-screen backdrop-blur-[1px]">{children}</div>
      </body>
    </html>
  );
}
