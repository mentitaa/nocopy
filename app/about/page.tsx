import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid #f1f5f9', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: '#111827', textDecoration: 'none' }}>NoCopy😉</Link>
        <Link href="/" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>← Back to rankings</Link>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.03em', color: '#111827', marginBottom: '8px', lineHeight: 0.95 }}>
          About
        </h1>
        <div style={{ height: '3px', width: '48px', background: '#0ea5e9', borderRadius: '2px', marginBottom: '48px' }} />

        <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.8', marginBottom: '24px' }}>
          NoCopy is a real-time leaderboard that tracks the top-performing traders on <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 500 }}>Polymarket</a> — the world's largest prediction market platform. Every position, trade, and outcome is publicly verifiable on-chain.
        </p>

        <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.8', marginBottom: '24px' }}>
          We surface that data — ranked by Profit & Loss across 7-day, 1-month, and 3-month windows — so anyone can study who consistently gets it right, how much capital they deploy, and over what timeframe. The best traders leave traces. NoCopy just makes them easier to find.
        </p>

        <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.8', marginBottom: '48px' }}>
          What you do with that information is entirely up to you.
        </p>

        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#111827', marginBottom: '16px' }}>Methodology</h2>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.8', marginBottom: '16px' }}>
          Rankings are pulled directly from Polymarket's public data API and sorted by net P&L in USD. Data refreshes automatically every 2 minutes. We display the top 15 or 30 traders depending on the selected filter, across three time windows: 7 days, 1 month, and 3 months.
        </p>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.8', marginBottom: '48px' }}>
          Volume is used as a secondary signal to distinguish consistent high-performers from one-time outliers. Traders who appear across multiple time windows with strong P&L and significant volume are the ones worth studying.
        </p>

        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#111827', marginBottom: '16px' }}>Disclaimer</h2>
        <div style={{ borderLeft: '3px solid #f1f5f9', paddingLeft: '20px' }}>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.8', marginBottom: '16px' }}>
            NoCopy is an independent, non-affiliated tool. We are not associated with Polymarket in any way. All data displayed is sourced from Polymarket's publicly accessible API and reflects on-chain activity.
          </p>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.8', marginBottom: '16px' }}>
            <strong style={{ color: '#374151' }}>This is not financial advice.</strong> Nothing on this website should be interpreted as a recommendation to buy, sell, trade, or copy any trading activity. Past performance of any trader does not guarantee future results. Prediction markets carry significant risk.
          </p>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.8' }}>
            Trader profiles and usernames are public information voluntarily associated with on-chain wallet addresses on the Polymarket platform. We do not store, process, or sell any personal data.
          </p>
        </div>

        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>Data: Polymarket · Not affiliated</span>
          <Link href="/" style={{ fontSize: '13px', color: '#0ea5e9', textDecoration: 'none' }}>← Back to rankings</Link>
        </div>

      </div>
    </div>
  );
}
