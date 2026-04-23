'use client';
import { Trader, fmtUSD } from '@/lib/polymarket';
import clsx from 'clsx';

interface Props {
  traders: Trader[];
  loading?: boolean;
}

export default function Ticker({ traders, loading }: Props) {
  const items = loading
    ? Array.from({ length: 10 }, (_, i) => ({ rank: i + 1, username: `Trader ${i + 1}`, profit: 0 }))
    : traders.slice(0, 20);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className="border-t border-b border-gray-200 bg-gray-50"
      style={{ height: '44px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          animation: 'ticker-scroll 35s linear infinite',
        }}
      >
        {doubled.map((t, i) => {
          const trader = t as Trader & { username?: string };
          const name = trader.username || trader.name || `Trader ${i + 1}`;
          const profit = trader.profit ?? 0;
          return (
            <span key={i} className="inline-flex items-center gap-2 px-6 text-sm font-mono">
              <span className="text-gray-400 text-xs">#{(i % items.length) + 1}</span>
              <span className="text-gray-700">{name}</span>
              <span className={clsx('font-semibold', profit >= 0 ? 'text-green-500' : 'text-red-400')}>
                {loading ? '——' : fmtUSD(profit)}
              </span>
              <span className="text-gray-300 text-xs">◆</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
