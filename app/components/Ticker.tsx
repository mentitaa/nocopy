'use client';
import { useEffect, useState } from 'react';
import { Trader, fmtUSD } from '@/lib/polymarket';

interface Props { traders: Trader[]; loading?: boolean; }

export default function Ticker({ traders, loading }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Espera 2 frames para que el DOM tenga el ancho real
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Reinicia animación si la pestaña vuelve a estar visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setReady(false);
        requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const items = loading
    ? Array.from({ length: 10 }, (_, i) => ({ rank: i+1, username: `Trader ${i+1}`, name: `Trader ${i+1}`, profit: 0 } as Trader))
    : traders.slice(0, 15);

  if (items.length === 0) return null;

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className="border-t border-b border-gray-200 bg-gray-50"
      style={{ height: '44px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
      <div
        style={{
          display: 'flex',
          willChange: 'transform',
          animation: ready ? 'ticker-scroll 50s linear infinite' : 'none',
        }}
      >
        {repeated.map((t, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '0 24px', whiteSpace: 'nowrap',
              fontSize: '13px', fontFamily: 'monospace'
            }}
          >
            <span style={{ color: '#9ca3af', fontSize: '11px' }}>#{(i % items.length) + 1}</span>
            <span style={{ color: '#374151' }}>{t.username || t.name}</span>
            <span style={{ color: t.profit >= 0 ? '#22c55e' : '#f87171', fontWeight: 600 }}>
              {loading ? '——' : fmtUSD(t.profit)}
            </span>
            <span style={{ color: '#e5e7eb' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
