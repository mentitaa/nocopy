'use client';
import { Trader, fmtUSD } from '@/lib/polymarket';

interface Props { traders: Trader[]; loading: boolean; }

export default function Charts({ traders, loading }: Props) {
  if (loading || traders.length === 0) return null;
  const top3 = traders.slice(0, 3);
  const rest = traders.slice(3);
  const maxProfit = Math.max(...traders.map(t => t.profit), 1);

  const MEDALS = [
    { label: '1ST', color: '#f5c542', bg: '#fffbeb', border: '#f5c542', textColor: '#92400e', h: 140 },
    { label: '2ND', color: '#94a3b8', bg: '#f8fafc', border: '#cbd5e1', textColor: '#475569', h: 100 },
    { label: '3RD', color: '#d97706', bg: '#fffbeb', border: '#fcd34d', textColor: '#92400e', h: 80 },
  ];
  const podiumOrder = [1, 0, 2];

  return (
    <div style={{ marginTop: '56px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#0ea5e9', letterSpacing: '0.3em' }}>02 /</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #0ea5e9, transparent)' }} />
      </div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em', color: '#111827', marginBottom: '32px', lineHeight: 1 }}>
        P&L <span style={{ color: '#0ea5e9' }}>BREAKDOWN</span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>

        {/* LEFT — Podium */}
        <div style={{ border: '1px solid #f1f5f9', borderRadius: '20px', padding: '24px', background: '#fff' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '28px' }}>Top 3</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '8px', height: '220px' }}>
            {podiumOrder.map(pos => {
              const t = top3[pos];
              if (!t) return null;
              const m = MEDALS[pos];
              return (
                <div key={pos} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'center', marginBottom: '8px', padding: '0 4px' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '2px' }}>{m.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>{t.name || t.username}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: m.color, fontFamily: 'monospace' }}>+{fmtUSD(t.profit)}</div>
                  </div>
                  <div style={{
                    width: '100%', height: `${m.h}px`,
                    background: m.bg, border: `1.5px solid ${m.border}`,
                    borderRadius: '10px 10px 0 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '22px', fontWeight: 900, color: m.color, fontFamily: 'monospace' }}>{pos + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Bar chart */}
        <div style={{ border: '1px solid #f1f5f9', borderRadius: '20px', padding: '24px', background: '#fff' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px' }}>Positions #{top3.length + 1} — #{traders.length}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rest.map(t => {
              const pct = Math.max((t.profit / maxProfit) * 100, 3);
              const isTop = t.rank <= 6;
              return (
                <div key={t.address || t.username} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '28px', fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', textAlign: 'right', flexShrink: 0 }}>#{t.rank}</span>
                  <span style={{ width: '88px', fontSize: '12px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.name || t.username}</span>
                  <div style={{ flex: 1, height: '22px', background: '#f8fafc', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid #f1f5f9' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${pct}%`,
                      background: isTop ? '#0ea5e9' : '#bae6fd',
                      borderRadius: '6px',
                      transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
                    }} />
                    <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, color: '#374151', zIndex: 1 }}>
                      +{fmtUSD(t.profit)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
