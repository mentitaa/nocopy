'use client';
import { Trader, fmtUSD } from '@/lib/polymarket';
import clsx from 'clsx';

interface Props {
  traders: Trader[];
  loading?: boolean;
}

const PLACEHOLDERS = Array.from({ length: 8 }, (_, i) => ({
  name: `Trader ${i + 1}`,
  profit: Math.random() * 100000,
}));

export default function Ticker({ traders, loading }: Props) {
  const items = loading
    ? PLACEHOLDERS.map((p) => ({ name: p.name, profit: p.profit, rank: 0 }))
    : traders.slice(0, 10);

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-t border-b border-[#1a1a1a] py-3 bg-[#0b0b0b]">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span
            key={i}
            className={clsx(
              'flex items-center gap-3 px-8 text-sm font-mono whitespace-nowrap',
              loading && 'opacity-30',
            )}
          >
            {/* rank dot */}
            {!loading && (
              <span
                className={clsx(
                  'text-xs font-body',
                  i % doubled.length < 3 ? 'text-gold' : 'text-ash',
                )}
              >
                #{(i % items.length) + 1}
              </span>
            )}
            <span className="text-paper/80 tracking-wide">
              {'name' in t ? (t as { name: string }).name : ''}
            </span>
            <span
              className={clsx(
                'font-semibold',
                !loading && (t as Trader).profit >= 0
                  ? 'text-up'
                  : 'text-down',
              )}
            >
              {loading
                ? '——'
                : fmtUSD((t as Trader).profit)}
            </span>
            <span className="text-[#2e2e2e] text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
