'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Period, Trader, PERIOD_LABELS } from '@/lib/polymarket';
import clsx from 'clsx';
import { useReveal } from '@/app/hooks/useReveal';
import PeriodTabs from './PeriodTabs';
import LeaderboardTable from './LeaderboardTable';
import HeroStats from './HeroStats';
import Ticker from './Ticker';
import Charts from './Charts';

const REFRESH = 120_000;

/* ── Navbar ───────────────────────────────────────────────── */
function Navbar({ countdown, onRefresh, loading }: { countdown: number; onRefresh: () => void; loading: boolean; }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/8 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          <a href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em', color: '#111827', textDecoration: 'none' }}>
            NoCopy😉
          </a>
          <span style={{
            fontSize: '11px',
            color: '#9ca3af',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            borderLeft: '1px solid #e5e7eb',
            paddingLeft: '14px',
            marginLeft: '14px',
          }}>
            Do your own research.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
            <span className="live-dot" />
            <span className="hide-sm">{loading ? 'loading…' : `REFRESH IN ${countdown}S`}</span>
          </div>
          <button onClick={onRefresh} disabled={loading}
            className="px-3 py-1.5 text-xs font-mono border border-black/15 rounded-lg text-gray-500 hover:text-sky-500 hover:border-sky-300 transition-all disabled:opacity-30">
            ↻
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ── Big section heading with line ───────────────────────── */
function SectionHeading({ n, title, sub }: { n: string; title: string; sub?: string }) {
  const ref = useReveal<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className="reveal mb-12">
      <div className="flex items-center gap-4 mb-4">
        <span className="font-mono text-xs text-sky-500 tracking-[0.3em]">{n}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-sky-300 to-transparent" />
      </div>
      <h2
        className="font-display font-bold text-black"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      {sub && <p className="text-gray-400 mt-4 text-base max-w-xl">{sub}</p>}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const [period, setPeriod] = useState<Period>('1w');
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState('');
  const [countdown, setCountdown] = useState(REFRESH / 1000);
  const [limit, setLimit] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (p: Period) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leaderboard?period=${p}&limit=${limit}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTraders(data.traders ?? []);
      setUpdatedAt(data.updatedAt ?? '');
      setCountdown(REFRESH / 1000);
    } catch (e) {
      setError('Could not load data. Retrying soon…');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(period); }, [period, load]);
  useEffect(() => { load(period); }, [limit, load]);

  useEffect(() => {
    timerRef.current = setInterval(() => load(period), REFRESH);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [period, load]);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c <= 1 ? REFRESH / 1000 : c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const heroRef = useReveal<HTMLDivElement>(0.05);
  const tableRef = useReveal<HTMLDivElement>(0.05);

  return (
    <div>
      <Navbar countdown={countdown} onRefresh={() => load(period)} loading={loading} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="grid-bg flex items-center" style={{ height: 'calc(100vh - 56px)', paddingTop: '56px' }}>
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Left: text card */}
            <div>
              <div ref={heroRef} className="reveal card-border p-10 mb-6">
                <h1
                  className="font-display font-bold text-black leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', letterSpacing: '-0.03em' }}
                >
                  NoCopy😉 →
                </h1>
                <h1
                  className="font-display font-bold leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', letterSpacing: '-0.03em', color: '#0ea5e9' }}
                >
                  Best traders
                </h1>
                <h1
                  className="font-display font-bold text-black leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', letterSpacing: '-0.03em' }}
                >
                  in real time.
                </h1>
              </div>

              {/* Icon cards row */}
              <div className="grid grid-cols-4 gap-3 reveal reveal-delay-3">
                {[
                  { icon: '⬡', label: 'Polymarket' },
                  { icon: '🌐', label: 'Global' },
                  { icon: '📊', label: 'Rankings' },
                  { icon: '↗', label: 'Live' },
                ].map((c) => (
                  <div key={c.label} className="card-border p-4 flex flex-col items-center gap-2 hover:border-sky-300 transition-colors">
                    <span className="text-2xl">{c.icon}</span>
                    <span className="text-xs text-gray-400 font-mono">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: hero image */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '460px',
              padding: '24px',
            }}>
              <img
                src="/hero.png"
                alt="NoCopy"
                style={{
                  width: '100%',
                  objectFit: 'contain',
                  maxHeight: '420px',
                  transform: 'rotate(-8deg)',
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.15))',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────────── */}
      <Ticker traders={traders} loading={loading} />

      {/* ── RANKING TABLE ─────────────────────────────────── */}
      <section className="px-6 py-20 bg-white border-t border-black/8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            n="01 /"
            title={`RANKING — ${PERIOD_LABELS[period]}`}
            sub="Ranked by Profit & Loss. Click any trader to view their full profile."
          />

          {/* Controls */}
          <div ref={tableRef} className="reveal flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <PeriodTabs active={period} onChange={setPeriod} disabled={loading} />
            <div className="flex flex-col items-end gap-2">
              {updatedAt && (
                <span className="text-xs font-mono text-gray-400">
                  Updated {new Date(updatedAt).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', second:'2-digit'})}
                </span>
              )}
              <div className="flex items-center gap-1 border border-gray-200 rounded-full p-1">
                <button onClick={() => setLimit(15)} className={clsx('px-4 py-1.5 rounded-full text-sm font-medium transition-all', limit === 15 ? 'bg-sky-500 text-white' : 'text-gray-400 hover:text-gray-700')}>
                  Top 15
                </button>
                <button onClick={() => setLimit(30)} className={clsx('px-4 py-1.5 rounded-full text-sm font-medium transition-all', limit === 30 ? 'bg-sky-500 text-white' : 'text-gray-400 hover:text-gray-700')}>
                  Top 30
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl border border-red-300/30 bg-red-50 text-red-500 text-sm font-mono">
              ⚠ {error}
            </div>
          )}

          <LeaderboardTable traders={traders} loading={loading} />
          <Charts traders={traders} loading={loading} />
        </div>
      </section>

      {/* ── SECOND TICKER ─────────────────────────────────── */}
      <Ticker traders={[...traders].reverse()} loading={loading} />

      {/* ── METHODOLOGY ───────────────────────────────────── */}
      <section className="px-6 py-24 bg-gray-50 border-t border-black/8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#0ea5e9', letterSpacing: '0.3em' }}>03 /</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #0ea5e9, transparent)' }} />
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.02em', color: '#111827', lineHeight: 0.9, marginBottom: '24px' }}>
            METHODOLOGY
          </h2>

          {/* Intro text */}
          <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '680px', lineHeight: '1.75', marginBottom: '48px' }}>
            The best traders leave traces. Every position, every market, every outcome —
            all publicly verifiable on-chain. NoCopy surfaces that data so you can study
            who consistently gets it right, how much they move, and when.
            What you do with that information is entirely up to you.
          </p>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              {
                icon: '◈',
                title: 'Profit & Loss (P&L)',
                body: 'Net USD profit generated by the trader in the selected period. The primary signal — a positive P&L over time is hard to fake.',
              },
              {
                icon: '◉',
                title: 'Volume',
                body: 'Total capital deployed by the trader. High volume with high P&L separates serious players from lucky one-time bets.',
              },
              {
                icon: '◊',
                title: 'Consistency',
                body: 'Traders ranked across 7-day, 1-month, and 3-month windows. Those who appear in all three are the ones worth paying attention to.',
              },
            ].map(card => (
              <div
                key={card.title}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '28px',
                  background: '#fff',
                }}
              >
                <span style={{ fontSize: '22px', display: 'block', marginBottom: '16px' }}>{card.icon}</span>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: '10px' }}>{card.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>{card.body}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 text-xs font-mono">
          <span>
            NOCOPY — Data:{' '}
            <a
              href="https://polymarket.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:underline"
            >
              Polymarket
            </a>{' '}
            · Not affiliated
          </span>
          <span>Auto-updates every 2 min</span>
        </div>
      </footer>
    </div>
  );
}
