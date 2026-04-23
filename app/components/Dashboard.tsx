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
function Navbar({
  countdown,
  onRefresh,
  loading,
}: {
  countdown: number;
  onRefresh: () => void;
  loading: boolean;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#141414] bg-ink/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="text-gold font-display font-bold text-xl tracking-tight">
            NO<span className="text-paper">COPY</span>
          </span>
        </a>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-ash text-xs font-mono">
            <span className="live-dot" />
            <span className="hide-sm">
              {loading ? 'cargando…' : `refresca en ${countdown}s`}
            </span>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-mono border border-[#2e2e2e] rounded-lg text-ash hover:text-gold hover:border-gold/40 transition-all disabled:opacity-30"
          >
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
        <span className="font-mono text-xs text-gold tracking-[0.3em]">{n}</span>
        <div className="hr-gold flex-1" />
      </div>
      <h2
        className="font-display font-bold text-gradient-gold"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      {sub && <p className="text-ash mt-4 text-base max-w-xl">{sub}</p>}
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
    <div className="noise">
      <Navbar countdown={countdown} onRefresh={() => load(period)} loading={loading} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero-bg pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={heroRef} className="reveal mb-4">
            <span className="text-gold font-mono text-xs tracking-[0.4em] uppercase">
              Datos en tiempo real · Polymarket
            </span>
          </div>

          {/* Main headline */}
          <div className="overflow-hidden mb-3">
            <h1
              className="reveal font-display font-bold text-paper reveal-delay-1"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
              }}
            >
              TOP
            </h1>
          </div>
          <div className="overflow-hidden mb-8">
            <h1
              className="reveal font-display font-bold text-gradient-gold reveal-delay-2"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
              }}
            >
              TRADERS
            </h1>
          </div>

          <p className="reveal reveal-delay-3 text-ash text-lg max-w-md mb-12 leading-relaxed">
            Ranking en vivo de las cuentas con mayor eficiencia y crecimiento en{' '}
            <span className="text-paper">Polymarket</span>. Actualización automática cada 2 minutos.
          </p>

          {/* Stats */}
          <div className="reveal reveal-delay-4">
            <HeroStats traders={traders} loading={loading} />
          </div>
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────────── */}
      <Ticker traders={traders} loading={loading} />

      {/* ── RANKING TABLE ─────────────────────────────────── */}
      <section className="px-6 py-20 section-alt">
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
            <div className="flex items-center gap-3 text-xs font-mono text-ash">
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
            <div className="mb-6 px-4 py-3 rounded-xl border border-down/30 bg-down/5 text-down text-sm font-mono">
              ⚠ {error}
            </div>
          )}

          <LeaderboardTable traders={traders} loading={loading} />
        </div>
      </section>

      {/* ── SECOND TICKER ─────────────────────────────────── */}
      <Ticker traders={[...traders].reverse()} loading={loading} />

      {/* ── METHODOLOGY ───────────────────────────────────── */}
      <section className="px-6 py-24 hero-bg">
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
                body:
                  'Ganancia neta en USD generada por el trader en el período seleccionado, considerando posiciones cerradas y abiertas.',
                delay: '0s',
              },
              {
                icon: '◉',
                title: 'ROI',
                body:
                  'Retorno sobre la inversión: P&L dividido entre el capital total desplegado. Normaliza el desempeño independientemente del tamaño.',
                delay: '0.1s',
              },
              {
                icon: '◊',
                title: 'Win Rate',
                body:
                  'Porcentaje de mercados donde el trader obtuvo ganancia. Combinado con P&L refleja calidad de las decisiones.',
                delay: '0.2s',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="reveal border border-[#1e1e1e] rounded-2xl p-6 bg-[#0b0b0b] hover:border-gold/20 transition-colors"
                style={{ transitionDelay: card.delay }}
              >
                <span className="text-gold text-2xl block mb-4">{card.icon}</span>
                <h3 className="font-display font-bold text-paper text-lg mb-2">{card.title}</h3>
                <p className="text-ash text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-[#141414] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-ash text-xs font-mono">
          <span>
            NOCOPY — Datos:{' '}
            <a
              href="https://polymarket.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
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
