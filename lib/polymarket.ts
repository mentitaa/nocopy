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
  const days = PERIOD_DAYS[period];
  const url = `https://data-api.polymarket.com/profiles?limit=${limit}&sortBy=profitAndLoss&sortDirection=DESC&window=${days}d`;

  const r = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 120 },
  });
  if (!r.ok) throw new Error(`Polymarket API ${r.status}`);

  const raw = await r.json();
  const list: unknown[] = Array.isArray(raw)
    ? raw
    : ((raw as Record<string, unknown>).data ?? (raw as Record<string, unknown>).profiles ?? (raw as Record<string, unknown>).traders ?? []) as unknown[];

  const traders: Trader[] = list.slice(0, limit).map((t: unknown, i: number) => {
    const row = t as Record<string, unknown>;
    const parseF = (keys: string[]) => {
      for (const k of keys) if (row[k] != null) return parseFloat(String(row[k]));
      return 0;
    };
    const parseI = (keys: string[]) => {
      for (const k of keys) if (row[k] != null) return parseInt(String(row[k]), 10);
      return 0;
    };
    const parseS = (keys: string[]) => {
      for (const k of keys) if (row[k] != null) return String(row[k]);
      return '';
    };
    const wr = parseF(['winRate']);
    return {
      rank: i + 1,
      address: parseS(['proxyWallet', 'address']),
      username: parseS(['username', 'name']) || `trader_${i + 1}`,
      name: parseS(['displayUsername', 'username', 'name']) || `Trader ${i + 1}`,
      profileImage: row.profileImage ? String(row.profileImage) : undefined,
      profit: parseF(['pnl', 'profitAndLoss', 'profit']),
      profitPct: parseF(['pnlChange', 'profitPct']),
      volume: parseF(['volume', 'totalVolume']),
      marketsTraded: parseI(['marketsTraded', 'numTrades']),
      winRate: wr > 1 ? wr : wr * 100,
      roi: parseF(['roi', 'return']),
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
