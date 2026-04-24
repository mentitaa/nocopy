import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NoCopy😉 — Best Traders on Polymarket',
  description: 'Real-time leaderboard of the top-performing traders on Polymarket. Ranked by P&L across 7 days, 1 month, and 3 months. The best traders leave traces.',
  keywords: ['polymarket', 'traders', 'ranking', 'prediction markets', 'leaderboard', 'crypto', 'best traders'],
  metadataBase: new URL('https://nocopypoly.vercel.app'),
  openGraph: {
    title: 'NoCopy😉 — Best Traders on Polymarket',
    description: 'Real-time leaderboard of the top-performing traders on Polymarket. The best traders leave traces.',
    url: 'https://nocopypoly.vercel.app',
    siteName: 'NoCopy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoCopy😉 — Best Traders on Polymarket',
    description: 'Real-time leaderboard of the top-performing traders on Polymarket.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
