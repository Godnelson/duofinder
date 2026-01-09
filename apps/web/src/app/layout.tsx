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
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,144,255,0.25),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(34,211,238,0.18),_transparent_40%)]">
          {children}
        </div>
      </body>
    </html>
  );
}
