'use client';

import { Trader, fmtUSD, fmtPct } from '@/lib/polymarket';
import { useCounter } from '@/app/hooks/useCounter';
import { useReveal } from '@/app/hooks/useReveal';

interface Props {
  traders: Trader[];
  loading: boolean;
}

function BigStat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  const ref = useReveal<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className="reveal reveal-delay-1">
      <p className="text-gray-400 text-xs font-mono uppercase tracking-[0.2em] mb-3">{label}</p>
      <p
        className="font-display font-bold"
        style={{
          fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
          lineHeight: 0.95,
          color: color ?? '#0a0a0a',
        }}
      >
        {value}
      </p>
      {sub && <p className="text-gray-400 text-sm mt-2">{sub}</p>}
    </div>
  );
}

function CounterStat({
  label,
  rawValue,
  format,
  sub,
  color,
  active,
}: {
  label: string;
  rawValue: number;
  format: (v: number) => string;
  sub?: string;
  color?: string;
  active: boolean;
}) {
  const counted = useCounter(rawValue, 1600, active);
  const ref = useReveal<HTMLDivElement>(0.2);

  return (
    <div ref={ref} className="reveal">
      <p className="text-gray-400 text-xs font-mono uppercase tracking-[0.2em] mb-3">{label}</p>
      <p
        className="font-display font-bold counter-value"
        style={{
          fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
          lineHeight: 0.95,
          color: color ?? '#0a0a0a',
        }}
      >
        {format(counted)}
      </p>
      {sub && <p className="text-gray-400 text-sm mt-2">{sub}</p>}
    </div>
  );
}

export default function HeroStats({ traders, loading }: Props) {
  const topProfit = traders[0]?.profit ?? 0;
  const totalVol = traders.reduce((s, t) => s + t.volume, 0);
  const avgROI = traders.length
    ? traders.reduce((s, t) => s + t.roi, 0) / traders.length
    : 0;
  const active = !loading && traders.length > 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
      <CounterStat
        label="Mayor P&L"
        rawValue={topProfit}
        format={(v) => fmtUSD(v)}
        sub={traders[0]?.name ?? '—'}
        color="#0ea5e9"
        active={active}
      />
      <CounterStat
        label="Volumen top 50"
        rawValue={totalVol}
        format={(v) => fmtUSD(v)}
        sub="últimos 7 días"
        active={active}
      />
      <CounterStat
        label="ROI promedio"
        rawValue={avgROI}
        format={(v) => fmtPct(v)}
        sub="top 50 traders"
        color={avgROI >= 0 ? '#22c55e' : '#ef4444'}
        active={active}
      />
      <CounterStat
        label="Traders activos"
        rawValue={traders.length}
        format={(v) => Math.round(v).toString()}
        sub="en ranking"
        active={active}
      />
    </div>
  );
}
