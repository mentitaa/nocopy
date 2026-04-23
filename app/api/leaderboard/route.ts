import { NextRequest, NextResponse } from 'next/server';
import { fetchLeaderboard, Period } from '@/lib/polymarket';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const period = (req.nextUrl.searchParams.get('period') ?? '1w') as Period;
  const limit  = parseInt(req.nextUrl.searchParams.get('limit') ?? '50', 10);
  try {
    const data = await fetchLeaderboard(period, limit);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60' },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { traders: [], updatedAt: new Date().toISOString(), error: String(e) },
      { status: 500 },
    );
  }
}
