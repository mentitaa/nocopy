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

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-t border-b border-gray-200 py-3 bg-gray-50">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span
            key={i}
            className={clsx(
              'flex items-center gap-3 px-8 text-sm font-mono whitespace-nowrap',
              loading && 'opacity-30',
            )}
          >
            {!loading && (
              <span
                className={clsx(
                  'text-xs font-body',
                  i % doubled.length < 3 ? 'text-sky-500' : 'text-gray-400',
                )}
              >
                #{(i % items.length) + 1}
              </span>
            )}
            <span className="text-gray-600 tracking-wide">
              {'name' in t ? (t as { name: string }).name : ''}
            </span>
            <span
              className={clsx(
                'font-semibold',
                !loading && (t as Trader).profit >= 0
                  ? 'text-green-500'
                  : 'text-red-400',
              )}
            >
              {loading
                ? '——'
                : fmtUSD((t as Trader).profit)}
            </span>
            <span className="text-gray-200 text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
