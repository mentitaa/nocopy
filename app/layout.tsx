import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NoCopy — Top Traders de Polymarket',
  description:
    'Ranking en tiempo real de los mejores traders de Polymarket. Filtra por 7 días, 1 mes y 3 meses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
