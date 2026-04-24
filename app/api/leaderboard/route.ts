import { NextRequest, NextResponse } from 'next/server';
import { fetchLeaderboard, Period } from '@/lib/polymarket';

export async function GET(req: NextRequest) {
  const period = (req.nextUrl.searchParams.get('period') ?? '1w') as Period;
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '15', 10);
  try {
    const data = await fetchLeaderboard(period, limit);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { traders: [], updatedAt: new Date().toISOString(), error: String(e) },
      { status: 500 },
    );
  }
}
