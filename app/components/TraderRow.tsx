'use client';
import { Trader, fmtUSD, fmtPct, shortAddr } from '@/lib/polymarket';
import clsx from 'clsx';

const MEDALS = ['🥇', '🥈', '🥉'];
const RANK_GLOWS = ['rank-1-glow text-yellow-500', 'rank-2-glow text-gray-400', 'rank-3-glow text-amber-600'];
const AVATAR_COLORS = [
  'from-yellow-500 to-amber-700',
  'from-slate-400 to-slate-600',
  'from-amber-600 to-orange-800',
  'from-cyan-500 to-blue-700',
  'from-purple-500 to-violet-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-indigo-500 to-blue-700',
];

function Avatar({ trader }: { trader: Trader }) {
  const grad = AVATAR_COLORS[(trader.rank - 1) % AVATAR_COLORS.length];
  return (
    <div
      className={clsx(
        'w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold',
        'bg-gradient-to-br text-white',
        grad,
      )}
    >
      {trader.profileImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={trader.profileImage}
          alt={trader.username}
          className="w-9 h-9 rounded-full object-cover"
        />
      ) : (
        trader.username.slice(0, 2).toUpperCase()
      )}
    </div>
  );
}

interface Props {
  trader: Trader;
  index: number;
}

export default function TraderRow({ trader, index }: Props) {
  const isTop3 = trader.rank <= 3;

  return (
    <tr
      className={clsx(
        'trader-row border-b border-gray-100',
        'reveal',
        index < 5 ? `reveal-delay-${Math.min(index + 1, 4)}` : '',
      )}
      style={index >= 5 ? { transitionDelay: `${Math.min(index * 0.04, 0.5)}s` } : undefined}
      onClick={() =>
        trader.address &&
        window.open(`https://polymarket.com/profile/${trader.address}`, '_blank')
      }
    >
      {/* Rank */}
      <td className="py-4 pl-6 pr-3 w-16">
        {isTop3 ? (
          <span className={clsx('text-xl', RANK_GLOWS[trader.rank - 1])}>
            {MEDALS[trader.rank - 1]}
          </span>
        ) : (
          <span className="text-gray-400 font-mono text-sm">#{trader.rank}</span>
        )}
      </td>

      {/* Trader */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <Avatar trader={trader} />
          <div>
            <p className="font-medium text-sm leading-tight" style={{color:'#111827'}}>{trader.name}</p>
            <p className="text-xs font-mono mt-0.5" style={{color:'#9ca3af'}}>
              {trader.address ? shortAddr(trader.address) : `@${trader.username}`}
            </p>
          </div>
        </div>
      </td>

      {/* P&L */}
      <td className="py-4 px-3">
        <p
          className={clsx(
            'font-mono font-semibold text-sm',
            trader.profit >= 0 ? 'text-green-500' : 'text-red-400',
          )}
        >
          {trader.profit >= 0 ? '+' : ''}{fmtUSD(trader.profit)}
        </p>
        {trader.profitPct !== 0 && (
          <p className={clsx('text-xs font-mono', trader.profitPct >= 0 ? 'text-green-500/60' : 'text-red-400/60')}>
            {fmtPct(trader.profitPct)}
          </p>
        )}
      </td>

      {/* ROI */}
      <td className="py-4 px-3 hide-sm">
        <span
          className={clsx(
            'font-mono text-sm font-semibold',
            trader.roi >= 0 ? 'text-green-500' : 'text-red-400',
          )}
        >
          {fmtPct(trader.roi)}
        </span>
      </td>

      {/* Win rate */}
      <td className="py-4 px-3 hide-sm">
        <div className="flex items-center gap-3 min-w-[100px]">
          <div className="wr-bar flex-1">
            <div
              className="wr-bar-fill"
              style={{ width: `${Math.min(trader.winRate, 100)}%` }}
            />
          </div>
          <span className="text-gray-600 text-xs font-mono w-9 text-right">
            {trader.winRate.toFixed(0)}%
          </span>
        </div>
      </td>

      {/* Volume */}
      <td className="py-4 px-3 hide-sm">
        <span className="text-gray-600 font-mono text-sm">{fmtUSD(trader.volume)}</span>
      </td>

      {/* Markets */}
      <td className="py-4 px-3 pr-6 hide-sm">
        <span className="text-gray-400 text-sm">{trader.marketsTraded}</span>
      </td>
    </tr>
  );
}
