'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    fetch('https://api.github.com/repos/mentitaa/nocopy')
      .then(r => r.json())
      .then(d => setStars(d.stargazers_count))
      .catch(() => {});
  }, []);
  return (
    <a
      href="https://github.com/mentitaa/nocopy"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        border: '1px solid #e5e7eb', borderRadius: '8px',
        padding: '4px 10px', fontSize: '12px', fontFamily: 'monospace',
        color: '#374151', textDecoration: 'none', background: '#fff',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#111827'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      ⭐ {stars !== null ? stars : '—'}
    </a>
  );
}

export default function AboutPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Mismo navbar que la página principal */}
      <nav style={{
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 24px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)', zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: '#111827', textDecoration: 'none', letterSpacing: '-0.02em' }}>
            NoCopy😉
          </Link>
          <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace', borderLeft: '1px solid #e5e7eb', paddingLeft: '14px', marginLeft: '14px', letterSpacing: '0.05em' }}>
            Do your own research.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/about" style={{ fontSize: '12px', color: '#111827', fontFamily: 'monospace', textDecoration: 'none', letterSpacing: '0.05em' }}>
            About
          </Link>
          <GitHubStars />
        </div>
      </nav>

      {/* Hero section con cuadrícula */}
      <div style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        borderBottom: '1px solid #f1f5f9',
        padding: '80px 24px 64px',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#0ea5e9', letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>nocopy / about</span>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.04em', color: '#111827', lineHeight: 0.9, marginBottom: '0' }}>
            About
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>

        <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.85', marginBottom: '24px' }}>
          NoCopy is a real-time leaderboard that tracks the top-performing traders on{' '}
          <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 500 }}>Polymarket</a>
          {' '}— the world&apos;s largest prediction market platform. Every position, trade, and outcome is publicly verifiable on-chain.
        </p>

        <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.85', marginBottom: '24px' }}>
          We surface that data — ranked by Profit &amp; Loss across 7-day, 1-month, and 3-month windows — so anyone can study who consistently gets it right, how much capital they deploy, and over what timeframe. The best traders leave traces. NoCopy just makes them easier to find.
        </p>

        <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.85', marginBottom: '56px' }}>
          What you do with that information is entirely up to you.
        </p>

        {/* Methodology */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#111827', marginBottom: '6px' }}>Methodology</h2>
          <div style={{ height: '2px', width: '32px', background: '#0ea5e9', borderRadius: '2px', marginBottom: '20px' }} />
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.85', marginBottom: '16px' }}>
            Rankings are pulled directly from Polymarket&apos;s public data API and sorted by net P&amp;L in USD. Data refreshes automatically every 2 minutes. We display the top 15 or 30 traders depending on the selected filter, across three time windows: 7 days, 1 month, and 3 months.
          </p>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.85' }}>
            Volume is used as a secondary signal to distinguish consistent high-performers from one-time outliers. Traders who appear across multiple time windows with strong P&amp;L and significant volume are the ones worth studying.
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#111827', marginBottom: '6px' }}>Disclaimer</h2>
          <div style={{ height: '2px', width: '32px', background: '#0ea5e9', borderRadius: '2px', marginBottom: '20px' }} />
          <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '28px' }}>
            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.85', marginBottom: '16px' }}>
              NoCopy is an independent, non-affiliated tool. We are not associated with Polymarket in any way. All data displayed is sourced from Polymarket&apos;s publicly accessible API and reflects on-chain activity.
            </p>
            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.85', marginBottom: '16px' }}>
              <strong style={{ color: '#374151' }}>This is not financial advice.</strong> Nothing on this website should be interpreted as a recommendation to buy, sell, trade, or copy any trading activity. Past performance of any trader does not guarantee future results. Prediction markets carry significant risk.
            </p>
            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.85', margin: 0 }}>
              Trader profiles and usernames are public information voluntarily associated with on-chain wallet addresses on the Polymarket platform. We do not store, process, or sell any personal data.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '32px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>Data: Polymarket · Not affiliated</span>
          <Link href="/" style={{ fontSize: '13px', color: '#0ea5e9', textDecoration: 'none', fontFamily: 'monospace' }}>← rankings</Link>
        </div>

      </div>
    </div>
  );
}
