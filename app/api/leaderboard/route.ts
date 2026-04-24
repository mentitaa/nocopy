import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get('period') ?? '1w';
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '15', 10), 50);

  const timePeriodMap: Record<string, string> = {
    '1w': 'WEEK',
    '1m': 'MONTH',
    '3m': 'ALL',
  };
  const timePeriod = timePeriodMap[period] ?? 'WEEK';

  try {
    const url = `https://data-api.polymarket.com/v1/leaderboard?timePeriod=${timePeriod}&orderBy=PNL&limit=${limit}`;

    const r = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!r.ok) throw new Error(`API ${r.status}`);
    const raw = await r.json();
    const list = Array.isArray(raw) ? raw : [];

    const traders = list.map((t: Record<string, unknown>, i: number) => ({
      rank: parseInt(String(t.rank ?? i + 1), 10),
      address: String(t.proxyWallet ?? ''),
      username: String(t.userName ?? t.xUsername ?? `trader_${i + 1}`),
      name: String(t.userName ?? `Trader ${i + 1}`),
      profileImage: t.profileImage ? String(t.profileImage) : undefined,
      profit: parseFloat(String(t.pnl ?? '0')),
      profitPct: 0,
      volume: parseFloat(String(t.vol ?? '0')),
      marketsTraded: 0,
      winRate: 0,
      roi: 0,
    }));

    return NextResponse.json(
      { traders, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
    );
  } catch (e) {
    return NextResponse.json(
      { traders: [], updatedAt: new Date().toISOString(), error: String(e) },
      { status: 500 }
    );
  }
}
