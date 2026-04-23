'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Period, Trader, PERIOD_LABELS } from '@/lib/polymarket';
import { useReveal } from '@/app/hooks/useReveal';
import PeriodTabs from './PeriodTabs';
import LeaderboardTable from './LeaderboardTable';
import HeroStats from './HeroStats';
import Ticker from './Ticker';

const REFRESH = 120_000;

/* ── Navbar ───────────────────────────────────────────────── */
function Navbar({ countdown, onRefresh, loading }: { countdown: number; onRefresh: () => void; loading: boolean; }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/8 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-display font-bold text-xl tracking-tight text-black">
          NoCopy😉
        </a>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
            <span className="live-dot" />
            <span className="hide-sm">{loading ? 'cargando…' : `refresca en ${countdown}s`}</span>
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (p: Period) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leaderboard?period=${p}&limit=50`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTraders(data.traders ?? []);
      setUpdatedAt(data.updatedAt ?? '');
      setCountdown(REFRESH / 1000);
    } catch (e) {
      setError('No se pudieron cargar los datos. Reintentando pronto…');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(period); }, [period, load]);

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

            {/* Right: 3D blob */}
            <div className="hero-gradient rounded-3xl flex items-center justify-center p-12 min-h-[460px] reveal reveal-delay-2">
              <div className="blob-3d" />
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
            sub="Clasificados por Profit & Loss. Haz click en cualquier trader para ver su perfil completo."
          />

          {/* Controls */}
          <div
            ref={tableRef}
            className="reveal flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <PeriodTabs active={period} onChange={setPeriod} disabled={loading} />
            <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
              {updatedAt && (
                <span>
                  Actualizado{' '}
                  {new Date(updatedAt).toLocaleTimeString('es-PE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              )}
              {loading && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Cargando...
                </span>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl border border-red-300/30 bg-red-50 text-red-500 text-sm font-mono">
              ⚠ {error}
            </div>
          )}

          <LeaderboardTable traders={traders} loading={loading} />
        </div>
      </section>

      {/* ── SECOND TICKER ─────────────────────────────────── */}
      <Ticker traders={[...traders].reverse()} loading={loading} />

      {/* ── METHODOLOGY ───────────────────────────────────── */}
      <section className="px-6 py-24 bg-gray-50 border-t border-black/8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            n="02 /"
            title="METODOLOGÍA"
            sub="Cómo calculamos el ranking."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '◈',
                title: 'Profit & Loss (P&L)',
                body: 'Ganancia neta en USD generada por el trader en el período seleccionado, considerando posiciones cerradas y abiertas.',
                delay: '0s',
              },
              {
                icon: '◉',
                title: 'ROI',
                body: 'Retorno sobre la inversión: P&L dividido entre el capital total desplegado. Normaliza el desempeño independientemente del tamaño.',
                delay: '0.1s',
              },
              {
                icon: '◊',
                title: 'Win Rate',
                body: 'Porcentaje de mercados donde el trader obtuvo ganancia. Combinado con P&L refleja calidad de las decisiones.',
                delay: '0.2s',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="reveal border border-gray-100 rounded-2xl p-6 bg-white hover:border-sky-200 transition-colors"
                style={{ transitionDelay: card.delay }}
              >
                <span className="text-sky-500 text-2xl block mb-4">{card.icon}</span>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 text-xs font-mono">
          <span>
            NOCOPY — Datos:{' '}
            <a
              href="https://polymarket.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:underline"
            >
              Polymarket
            </a>{' '}
            · No afiliado
          </span>
          <span>Actualización automática cada 2 min</span>
        </div>
      </footer>
    </div>
  );
}
