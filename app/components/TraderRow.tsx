'use client';
import { Trader, fmtUSD, fmtPct, shortAddr } from '@/lib/polymarket';

const MEDALS = ['🥇', '🥈', '🥉'];
const AVATAR_COLORS = [
  ['#f59e0b','#b45309'],['#94a3b8','#475569'],['#f97316','#c2410c'],
  ['#06b6d4','#0e7490'],['#8b5cf6','#6d28d9'],['#10b981','#065f46'],
  ['#f43f5e','#be123c'],['#6366f1','#4338ca'],
];

export default function TraderRow({ trader, index }: { trader: Trader; index: number }) {
  const isTop3 = trader.rank <= 3;
  const [from, to] = AVATAR_COLORS[(trader.rank - 1) % AVATAR_COLORS.length];

  return (
    <tr
      onClick={() => trader.address && window.open(`https://polymarket.com/profile/${trader.address}`, '_blank')}
      style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f0f9ff')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Rank */}
      <td style={{ padding: '14px 12px 14px 24px', width: '56px' }}>
        {isTop3
          ? <span style={{ fontSize: '20px' }}>{MEDALS[trader.rank - 1]}</span>
          : <span style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '13px' }}>#{trader.rank}</span>
        }
      </td>

      {/* Trader */}
      <td style={{ padding: '14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${from}, ${to})`,
            color: 'white', fontSize: '12px', fontWeight: 700,
          }}>
            {(trader.username || trader.name || '?').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p style={{ color: '#111827', fontWeight: 600, fontSize: '14px', margin: 0, lineHeight: 1.3 }}>
              {trader.name || trader.username}
            </p>
            <p style={{ color: '#9ca3af', fontSize: '11px', fontFamily: 'monospace', margin: 0 }}>
              {trader.address ? shortAddr(trader.address) : `@${trader.username}`}
            </p>
          </div>
        </div>
      </td>

      {/* P&L */}
      <td style={{ padding: '14px 12px' }}>
        <p style={{ color: trader.profit >= 0 ? '#22c55e' : '#f87171', fontFamily: 'monospace', fontWeight: 600, fontSize: '14px', margin: 0 }}>
          {trader.profit >= 0 ? '+' : ''}{fmtUSD(trader.profit)}
        </p>
        {trader.profitPct !== 0 && (
          <p style={{ color: trader.profitPct >= 0 ? '#86efac' : '#fca5a5', fontSize: '11px', fontFamily: 'monospace', margin: 0 }}>
            {fmtPct(trader.profitPct)}
          </p>
        )}
      </td>

      {/* Volume */}
      <td style={{ padding: '14px 12px 14px 12px' }}>
        <span style={{ color: '#374151', fontFamily: 'monospace', fontSize: '13px' }}>
          {fmtUSD(trader.volume)}
        </span>
      </td>
    </tr>
  );
}
