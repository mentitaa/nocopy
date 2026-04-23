'use client';
import { Trader, fmtUSD } from '@/lib/polymarket';

interface Props { traders: Trader[]; loading?: boolean; }

export default function Ticker({ traders, loading }: Props) {
  const items = loading
    ? Array.from({ length: 10 }, (_, i) => ({ rank: i+1, username: `Trader ${i+1}`, name: `Trader ${i+1}`, profit: 0 } as Trader))
    : traders.slice(0, 15);

  if (items.length === 0) return null;

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="border-t border-b border-gray-200 bg-gray-50" style={{height:'44px', overflow:'hidden', display:'flex', alignItems:'center'}}>
      <div style={{display:'flex', willChange:'transform', animation:'ticker-scroll 50s linear infinite'}}>
        {repeated.map((t, i) => (
          <span key={i} style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'0 24px', whiteSpace:'nowrap', fontSize:'13px', fontFamily:'monospace'}}>
            <span style={{color:'#9ca3af', fontSize:'11px'}}>#{(i % items.length) + 1}</span>
            <span style={{color:'#374151'}}>{t.username || t.name}</span>
            <span style={{color: t.profit >= 0 ? '#22c55e' : '#f87171', fontWeight:600}}>
              {loading ? '——' : fmtUSD(t.profit)}
            </span>
            <span style={{color:'#e5e7eb'}}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
