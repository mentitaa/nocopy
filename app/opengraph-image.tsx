import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'NoCopy — Best traders on Polymarket in real time';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#ffffff',
          padding: '80px',
          fontFamily: 'sans-serif',
          backgroundImage: 'radial-gradient(circle at 80% 50%, #e0f2fe 0%, transparent 60%)',
        }}
      >
        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px', display: 'flex' }} />

        {/* Tag */}
        <div style={{ fontSize: '18px', color: '#0ea5e9', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px', display: 'flex' }}>
          Real-time · Polymarket
        </div>

        {/* Title */}
        <div style={{ fontSize: '100px', fontWeight: 900, color: '#111827', lineHeight: 0.9, letterSpacing: '-4px', marginBottom: '8px', display: 'flex' }}>
          NoCopy😉
        </div>
        <div style={{ fontSize: '100px', fontWeight: 900, color: '#0ea5e9', lineHeight: 0.9, letterSpacing: '-4px', marginBottom: '8px', display: 'flex' }}>
          Best traders
        </div>
        <div style={{ fontSize: '100px', fontWeight: 900, color: '#111827', lineHeight: 0.9, letterSpacing: '-4px', marginBottom: '48px', display: 'flex' }}>
          in real time.
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '24px', color: '#6b7280', display: 'flex' }}>
          nocopypoly.vercel.app
        </div>

        {/* Bottom tag */}
        <div style={{ position: 'absolute', bottom: '48px', right: '80px', fontSize: '18px', color: '#9ca3af', display: 'flex' }}>
          Powered by Mentita Studio
        </div>
      </div>
    ),
    { ...size }
  );
}
