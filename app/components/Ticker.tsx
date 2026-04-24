'use client';
import { useEffect, useRef } from 'react';
import { Trader, fmtUSD } from '@/lib/polymarket';

interface Props { traders: Trader[]; loading?: boolean; }

export default function Ticker({ traders, loading }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const items = loading
    ? Array.from({ length: 12 }, (_, i) => ({ rank: i+1, username: `Trader ${i+1}`, name: `Trader ${i+1}`, profit: 0 } as Trader))
    : traders.slice(0, 15);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.animationName = 'none';
    el.style.animationPlayState = 'paused';

    const t = setTimeout(() => {
      if (!el) return;
      // Forzar reflow para que el navegador calcule el ancho real
      void el.offsetWidth;
      el.style.animationName = 'ticker-scroll';
      el.style.animationDuration = '50s';
      el.style.animationTimingFunction = 'linear';
      el.style.animationIterationCount = 'infinite';
      el.style.animationPlayState = 'running';
    }, 600);

    return () => clearTimeout(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className="border-t border-b border-gray-200 bg-gray-50"
      style={{ height: '44px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
      <div
        ref={ref}
        style={{
          display: 'flex',
          willChange: 'transform',
          animationName: 'none',
        }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {repeated.map((t, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '0 24px', whiteSpace: 'nowrap',
              fontSize: '13px', fontFamily: 'monospace',
            }}
          >
            <span style={{ color: '#9ca3af', fontSize: '11px' }}>#{(i % items.length) + 1}</span>
            <span style={{ color: '#374151' }}>{t.username || t.name}</span>
            <span style={{ fontWeight: 600, color: t.profit >= 0 ? '#22c55e' : '#f87171' }}>
              {loading ? '——' : fmtUSD(t.profit)}
            </span>
            <span style={{ color: '#e5e7eb' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
