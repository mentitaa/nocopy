export type Period = '1w' | '1m' | '3m';

export interface Trader {
  rank: number;
  address: string;
  username: string;
  name: string;
  profileImage?: string;
  profit: number;
  profitPct: number;
  volume: number;
  marketsTraded: number;
  winRate: number;
  roi: number;
}

export interface LeaderboardData {
  traders: Trader[];
  updatedAt: string;
}

const PERIOD_DAYS: Record<Period, number> = { '1w': 7, '1m': 30, '3m': 90 };
export const PERIOD_LABELS: Record<Period, string> = {
  '1w': '7 días',
  '1m': '1 mes',
  '3m': '3 meses',
};

export async function fetchLeaderboard(period: Period, limit = 50): Promise<LeaderboardData> {
  const windowMap: Record<Period, string> = { '1w': '7d', '1m': '30d', '3m': '90d' };
  const window = windowMap[period];
  const url = `https://data-api.polymarket.com/v1/leaderboard?window=${window}&limit=${limit}`;

  const r = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`Polymarket API ${r.status}`);

  const raw = await r.json();
  const list: unknown[] = Array.isArray(raw) ? raw : [];

  const traders: Trader[] = list.slice(0, limit).map((t: unknown, i: number) => {
    const row = t as Record<string, unknown>;
    return {
      rank: parseInt(String(row.rank ?? i + 1), 10),
      address: String(row.proxyWallet ?? ''),
      username: String(row.userName ?? row.xUsername ?? `trader_${i + 1}`),
      name: String(row.userName ?? `Trader ${i + 1}`),
      profileImage: row.profileImage ? String(row.profileImage) : undefined,
      profit: parseFloat(String(row.pnl ?? '0')),
      profitPct: 0,
      volume: parseFloat(String(row.vol ?? '0')),
      marketsTraded: 0,
      winRate: 0,
      roi: 0,
    };
  });

  return { traders, updatedAt: new Date().toISOString() };
}

export const fmtUSD = (v: number): string => {
  const abs = Math.abs(v);
  const s = v < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${s}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${s}$${(abs / 1_000).toFixed(1)}K`;
  return `${s}$${abs.toFixed(0)}`;
};

export const fmtPct = (v: number): string =>
  `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

export const shortAddr = (addr: string): string =>
  addr?.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
