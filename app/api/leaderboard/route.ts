import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get('period') ?? '1w';
  const windowMap: Record<string, string> = { '1w': '7d', '1m': '30d', '3m': '90d' };
  const w = windowMap[period] ?? '7d';

  const r = await fetch(
    `https://data-api.polymarket.com/v1/leaderboard?window=${w}&limit=3`,
    { headers: { Accept: 'application/json' } }
  );
  const raw = await r.json();

  return NextResponse.json({ raw });
}
