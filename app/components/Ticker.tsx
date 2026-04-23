'use client';
import { Trader, fmtUSD } from '@/lib/polymarket';
import clsx from 'clsx';

interface Props {
  traders: Trader[];
  loading?: boolean;
}

export default function Ticker({ traders, loading }: Props) {
  const items = loading
    ? Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1, name: `Trader ${i + 1}`, profit: 0, username: ''
      }))
    : traders.slice(0, 20);

  if (items.length === 0) return null;

  const content = [...items, ...items, ...items];

  return (
    <div
      className="border-t border-b border-gray-200 bg-gray-50 overflow-hidden"
      style={{ height: '44px', display: 'flex', alignItems: 'center' }}
    >
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'tickerMove 40s linear infinite',
          willChange: 'transform',
        }}
      >
        {content.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-6 text-sm font-mono"
          >
            <span className="text-gray-400 text-xs">
              #{(i % items.length) + 1}
            </span>
            <span className="text-gray-700">
              {'name' in t ? (t as {name: string}).name : (t as Trader).username}
            </span>
            <span className={clsx(
              'font-semibold',
              !loading && (t as Trader).profit >= 0 ? 'text-green-500' : 'text-red-400'
            )}>
              {loading ? '——' : fmtUSD((t as Trader).profit)}
            </span>
            <span className="text-gray-200 text-xs">◆</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes tickerMove {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
