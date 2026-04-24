'use client';
import { Trader } from '@/lib/polymarket';
import { useRevealChildren } from '@/app/hooks/useReveal';
import TraderRow from './TraderRow';
import clsx from 'clsx';

const COL = 'py-3 text-xs font-mono uppercase tracking-[0.15em] text-gray-400 text-left';

function SkeletonRow({ i }: { i: number }) {
  return (
    <tr className="border-b border-gray-100" style={{ opacity: 1 - i * 0.07 }}>
      <td className="py-4 pl-6 pr-3"><div className="skeleton h-4 w-6" /></td>
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <div className="skeleton w-9 h-9 rounded-full" />
          <div className="space-y-1.5">
            <div className="skeleton h-3.5 w-28" />
            <div className="skeleton h-2.5 w-20" />
          </div>
        </div>
      </td>
      <td className="py-4 px-3"><div className="skeleton h-4 w-20" /></td>
      <td className="py-4 px-3 pr-6"><div className="skeleton h-4 w-16" /></td>
    </tr>
  );
}

export default function LeaderboardTable({
  traders,
  loading,
}: {
  traders: Trader[];
  loading: boolean;
}) {
  const tableRef = useRevealChildren('.reveal', 0.05);

  return (
    <div
      ref={tableRef}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className={clsx(COL, 'pl-6 pr-3 w-16')}>Rank</th>
              <th className={clsx(COL, 'px-3')}>Trader</th>
              <th className={clsx(COL, 'px-3')}>P&L</th>
              <th className={clsx(COL, 'px-3 pr-6')}>Volumen</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <SkeletonRow key={i} i={i} />)
              : traders.map((t, i) => <TraderRow key={t.address || t.username} trader={t} index={i} />)}
          </tbody>
        </table>
      </div>

      {!loading && traders.length === 0 && (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg">Sin datos disponibles</p>
          <p className="text-gray-400/50 text-sm mt-2">Intenta otro período de tiempo</p>
        </div>
      )}
    </div>
  );
}
