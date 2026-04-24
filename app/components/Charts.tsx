'use client';
import { Trader, fmtUSD } from '@/lib/polymarket';

interface Props {
  traders: Trader[];
  loading: boolean;
}

const PODIUM_COLORS = ['#f5c542', '#a0aec0', '#cd7f32'];
const PODIUM_LABELS = ['🥇', '🥈', '🥉'];
const PODIUM_HEIGHTS = ['180px', '130px', '100px'];
const PODIUM_ORDER = [1, 0, 2]; // visual order: 2nd, 1st, 3rd

function PodiumBlock({ trader, position }: { trader: Trader; position: number }) {
  const color = PODIUM_COLORS[position];
  const height = PODIUM_HEIGHTS[position];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '28px', marginBottom: '4px' }}>{PODIUM_LABELS[position]}</div>
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#111827', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {trader.name || trader.username}
        </div>
        <div style={{ fontWeight: 700, fontSize: '18px', color: color, fontFamily: 'monospace', marginTop: '2px' }}>
          +{fmtUSD(trader.profit)}
        </div>
      </div>
      <div style={{
        width: '100%',
        height,
        background: color,
        borderRadius: '12px 12px 0 0',
        opacity: 0.85,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: 900,
        color: 'white',
      }}>
        {position === 0 ? '2' : position === 1 ? '1' : '3'}
      </div>
    </div>
  );
}

function BarChart({ traders }: { traders: Trader[] }) {
  const max = Math.max(...traders.map(t => t.profit), 1);
  return (
    <div style={{ marginTop: '8px' }}>
      {traders.map((t, i) => {
        const pct = Math.max((t.profit / max) * 100, 2);
        return (
          <div key={t.address || t.username} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '24px', textAlign: 'right', color: '#9ca3af', fontSize: '12px', fontFamily: 'monospace', flexShrink: 0 }}>
              #{t.rank}
            </div>
            <div style={{ width: '110px', color: '#374151', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t.name || t.username}
            </div>
            <div style={{ flex: 1, height: '28px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${pct}%`,
                background: t.profit >= 0
                  ? `linear-gradient(90deg, #22c55e, #4ade80)`
                  : `linear-gradient(90deg, #f87171, #fca5a5)`,
                borderRadius: '6px',
                transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
              }} />
              <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, color: '#374151', zIndex: 1 }}>
                {t.profit >= 0 ? '+' : ''}{fmtUSD(t.profit)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Charts({ traders, loading }: Props) {
  if (loading || traders.length === 0) return null;

  const top3 = traders.slice(0, 3);
  const rest = traders.slice(3);

  return (
    <div style={{ marginTop: '48px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '0.3em' }}>02 /</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #0ea5e9 30%, #0ea5e9 70%, transparent)' }} />
      </div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em', color: '#111827', marginBottom: '48px', lineHeight: 0.9 }}>
        P&L<br /><span style={{ color: '#0ea5e9' }}>BREAKDOWN</span>
      </h2>

      {/* Podio top 3 */}
      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '32px 24px 0', marginBottom: '32px', overflow: 'hidden' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>Top 3 traders</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '280px' }}>
          {PODIUM_ORDER.map(pos => (
            top3[pos] ? <PodiumBlock key={pos} trader={top3[pos]} position={pos} /> : null
          ))}
        </div>
      </div>

      {/* Barras del resto */}
      {rest.length > 0 && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '28px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>Posiciones #{top3.length + 1} — #{traders.length}</p>
          <BarChart traders={rest} />
        </div>
      )}
    </div>
  );
}
