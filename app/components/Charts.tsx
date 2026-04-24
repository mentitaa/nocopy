'use client';
import { useEffect, useRef, useState } from 'react';
import { Trader, fmtUSD } from '@/lib/polymarket';

interface Props { traders: Trader[]; loading: boolean; }

const COLORS = ['#f5c542', '#94a3b8', '#d97706'];
const LABELS = ['1ST', '2ND', '3RD'];

export default function Charts({ traders, loading }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [ready, setReady] = useState(false);

  const top3 = traders.slice(0, 3);

  useEffect(() => {
    if (loading || top3.length === 0) return;
    setReady(true);
  }, [loading, traders]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxProfit = Math.max(...top3.map(t => t.profit), 1);
    const DURATION = 4000;
    const PAUSE = 4000;
    let startTime: number | null = null;
    let phase: 'draw' | 'pause' = 'draw';
    let pauseStart: number | null = null;

    const W = canvas.width;
    const H = canvas.height;
    const PAD_L = 64;
    const PAD_R = 24;
    const PAD_T = 32;
    const PAD_B = 48;
    const CHART_W = W - PAD_L - PAD_R;
    const CHART_H = H - PAD_T - PAD_B;

    // Generate smooth path points for each trader
    const paths = top3.map((t, i) => {
      const pts: { x: number; y: number }[] = [];
      const steps = 60;
      for (let s = 0; s <= steps; s++) {
        const pct = s / steps;
        const eased = 1 - Math.pow(1 - pct, 2.5);
        const wobble = Math.sin(s * 0.8 + i * 2.1) * 0.015 * eased;
        pts.push({ x: pct, y: eased + wobble });
      }
      return pts;
    });

    function drawGrid() {
      if (!ctx) return;
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = PAD_T + CHART_H - (i / 4) * CHART_H;
        ctx.beginPath();
        ctx.moveTo(PAD_L, y);
        ctx.lineTo(PAD_L + CHART_W, y);
        ctx.stroke();
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        const val = (i / 4) * maxProfit;
        ctx.fillText(fmtUSD(val), PAD_L - 8, y + 4);
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD_L, PAD_T + CHART_H);
      ctx.lineTo(PAD_L + CHART_W, PAD_T + CHART_H);
      ctx.stroke();
    }

    function drawLines(progress: number) {
      if (!ctx) return;
      top3.forEach((trader, i) => {
        const pts = paths[i];
        const color = COLORS[i];

        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = color;
        ctx.lineWidth = i === 0 ? 3 : 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        const totalPts = Math.floor(progress * pts.length);
        for (let p = 0; p <= totalPts && p < pts.length; p++) {
          const pt = pts[p];
          let yVal = pt.y;
          if (p === totalPts && p < pts.length) {
            const frac = progress * pts.length - totalPts;
            const next = pts[Math.min(p + 1, pts.length - 1)];
            yVal = pt.y + (next.y - pt.y) * frac;
          }
          const x = PAD_L + pt.x * CHART_W;
          const y = PAD_T + CHART_H - (yVal * (trader.profit / maxProfit)) * CHART_H;
          p === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (progress > 0.05) {
          const lastIdx = Math.min(Math.floor(progress * pts.length), pts.length - 1);
          const lastPt = pts[lastIdx];
          let endY = lastPt.y;
          const frac = progress * pts.length - lastIdx;
          if (lastIdx < pts.length - 1) {
            const nextPt = pts[lastIdx + 1];
            endY = lastPt.y + (nextPt.y - lastPt.y) * frac;
          }
          const dotX = PAD_L + lastPt.x * CHART_W;
          const dotY = PAD_T + CHART_H - (endY * (trader.profit / maxProfit)) * CHART_H;
          ctx.beginPath();
          ctx.arc(dotX, dotY, i === 0 ? 5 : 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        if (progress > 0.85) {
          const alpha = Math.min(1, (progress - 0.85) / 0.15);
          const lastPt = pts[pts.length - 1];
          const finalX = PAD_L + lastPt.x * CHART_W;
          const finalY = PAD_T + CHART_H - (trader.profit / maxProfit) * CHART_H;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = color;
          ctx.font = `bold 11px monospace`;
          ctx.textAlign = 'left';
          const name = (trader.name || trader.username || '').slice(0, 10);
          ctx.fillText(`${LABELS[i]} ${name}`, finalX - 60, finalY - 10);
          ctx.font = '10px monospace';
          ctx.fillText(fmtUSD(trader.profit), finalX - 60, finalY + 4);
          ctx.globalAlpha = 1;
        }
      });
    }

    function tick(ts: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      drawGrid();

      if (phase === 'draw') {
        if (startTime === null) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        drawLines(progress);
        if (progress < 1) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          drawLines(1);
          phase = 'pause';
          pauseStart = ts;
          animRef.current = requestAnimationFrame(tick);
        }
      } else {
        if (!pauseStart) pauseStart = ts;
        drawLines(1);
        if (ts - pauseStart >= PAUSE) {
          phase = 'draw';
          startTime = null;
          pauseStart = null;
        }
        animRef.current = requestAnimationFrame(tick);
      }
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [ready, traders]);

  if (loading || top3.length === 0) return null;

  const rest = traders.slice(3);
  const maxProfit = Math.max(...traders.map(t => t.profit), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* TOP — Animated line chart */}
        <div style={{ border: '1px solid #f1f5f9', borderRadius: '20px', padding: '24px', background: '#fff', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>Top 3 — P&L Growth</p>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            {top3.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '20px', height: '2px', background: COLORS[i], borderRadius: '2px' }} />
                <span style={{ fontSize: '11px', color: '#374151', fontFamily: 'monospace' }}>
                  {LABELS[i]} · {(t.name || t.username || '').slice(0, 10)}
                </span>
              </div>
            ))}
          </div>
          <canvas
            ref={canvasRef}
            width={800}
            height={260}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* BOTTOM — Bar chart rest of traders */}
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
  );
}
