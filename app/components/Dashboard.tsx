'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Period, Trader, PERIOD_LABELS } from '@/lib/polymarket';
import clsx from 'clsx';
import Link from 'next/link';
import { useReveal } from '@/app/hooks/useReveal';
import PeriodTabs from './PeriodTabs';
import LeaderboardTable from './LeaderboardTable';
import HeroStats from './HeroStats';
import Ticker from './Ticker';
import Charts from './Charts';

const REFRESH = 120_000;

/* ── GitHub Stars ─────────────────────────────────────────── */
function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    fetch('https://api.github.com/repos/mentitaa/nocopy')
      .then(r => r.json())
      .then(d => { if (typeof d.stargazers_count === 'number') setStars(d.stargazers_count); })
      .catch(() => {});
  }, []);
  return (
    <a
      href="https://github.com/mentitaa/nocopy"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', fontFamily: 'monospace', color: '#6b7280',
        textDecoration: 'none', border: '1px solid #e5e7eb',
        borderRadius: '8px', padding: '4px 10px',
        transition: 'border-color 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#111827'; e.currentTarget.style.color = '#111827'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
      {stars !== null ? `★ ${stars}` : '★ Star'}
    </a>
  );
}

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
          <Link
            href="/about"
            style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace', textDecoration: 'none', letterSpacing: '0.05em' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#111827')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
          >
            About
          </Link>
          <GitHubStars />
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
      <section className="grid-bg flex items-center" style={{ minHeight: '380px', paddingTop: '72px', paddingBottom: '24px' }}>
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Left: text card */}
            <div>
              <div ref={heroRef} className="reveal card-border mb-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '32px 40px' }}>
                <h1
                  className="font-display font-bold text-black leading-none"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3.2rem)', letterSpacing: '-0.03em' }}
                >
                  NoCopy😉 →
                </h1>
                <h1
                  className="font-display font-bold leading-none"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3.2rem)', letterSpacing: '-0.03em', color: '#0ea5e9' }}
                >
                  Best traders
                </h1>
                <h1
                  className="font-display font-bold text-black leading-none"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3.2rem)', letterSpacing: '-0.03em' }}
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
              minHeight: '200px',
              padding: '24px',
            }}>
              <img
                src="/hero.png"
                alt="NoCopy"
                style={{
                  width: '100%',
                  objectFit: 'contain',
                  maxHeight: '220px',
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

          {/* Section header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#0ea5e9', letterSpacing: '0.3em' }}>01 /</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #0ea5e9, transparent)' }} />
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: '#111827', lineHeight: 0.95, margin: 0 }}>
              RANKING — {PERIOD_LABELS[period]}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px', marginBottom: 0 }}>
              Ranked by Profit &amp; Loss. Click any trader to view their full profile.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
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

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-500 text-sm font-mono">
              ⚠ {error}
            </div>
          )}

          {/* TWO COLUMN LAYOUT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px', alignItems: 'start' }}>

            {/* LEFT — Ranking table */}
            <div>
              <LeaderboardTable traders={traders} loading={loading} />
            </div>

            {/* RIGHT — Charts stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Charts traders={traders} loading={loading} />
            </div>

          </div>

        </div>
      </section>

      {/* ── SECOND TICKER ─────────────────────────────────── */}
      <Ticker traders={[...traders].reverse()} loading={loading} />

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 text-xs font-mono">
          <a
            href="https://www.instagram.com/mentita.studio/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace', letterSpacing: '0.05em' }}>Powered by</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1113.25 188.42"
              style={{ height: '14px', width: 'auto', opacity: 0.4, transition: 'opacity 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
            >
              <path fill="#1e1e1e" d="M920.66,0v188.42h48.75c10.41,0,18.84-8.44,18.84-18.84v-60.14h6.12v60.14c0,10.41,8.44,18.84,18.84,18.84h48.75V0h-141.31ZM994.38,78.98h-6.12v-42.15h6.12v42.15Z"/>
              <path fill="#1e1e1e" d="M288.85,134.46v-6.12h54.88c10.41,0,18.84-8.44,18.84-18.84v-30.2c0-10.41-8.44-18.84-18.84-18.84h-54.88v-6.12h54.88c10.41,0,18.84-8.44,18.84-18.84V0h-141.31v188.42h141.31v-35.12c0-10.41-8.44-18.84-18.84-18.84h-54.88Z"/>
              <path fill="#1e1e1e" d="M710.63,0h45.34C762.11,0,767.09,4.99,767.09,11.13v177.29h-67.6V11.13C699.5,4.99,704.48,0,710.63,0Z"/>
              <path fill="#1e1e1e" d="M110.61,18.84v82.08h-6.12V18.84C104.49,8.44,96.05,0,85.64,0H0v188.42h48.77c10.41,0,18.84-8.44,18.84-18.84v-56.53h6.12v56.53c0,10.41,8.44,18.84,18.84,18.84h29.94c10.41,0,18.84-8.44,18.84-18.84v-56.53h6.12v56.53c0,10.41,8.44,18.84,18.84,18.84h48.77V0h-85.64C119.05,0,110.61,8.44,110.61,18.84Z"/>
              <path fill="#1e1e1e" d="M478.38,18.84v57.53h-6.12V18.84C472.26,8.44,463.82,0,453.41,0h-84.73v188.42h48.75c10.41,0,18.84-8.44,18.84-18.84v-55.25h6.12v55.25c0,10.41,8.44,18.84,18.84,18.84h84.73V0h-48.75C486.82,0,478.38,8.44,478.38,18.84Z"/>
              <path fill="#1e1e1e" d="M552.1,0v38.18c0,10.41,8.44,18.84,18.84,18.84h18.02v131.4h67.6V57.02h18.02c10.41,0,18.84-8.44,18.84-18.84V0h-141.31Z"/>
              <path fill="#1e1e1e" d="M773.22,0v38.18c0,10.41,8.44,18.84,18.84,18.84h18.02v131.4h67.6V57.02h18.02c10.41,0,18.84-8.44,18.84-18.84V0h-141.31Z"/>
              <rect fill="#1e1e1e" x="1068.09" y="143.26" width="45.16" height="45.16" rx="13.78" ry="13.78"/>
            </svg>
          </a>
          <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>Auto-updates every 2 min</span>
        </div>
      </footer>
    </div>
  );
}
