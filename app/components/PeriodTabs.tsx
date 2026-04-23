'use client';
import { Period, PERIOD_LABELS } from '@/lib/polymarket';
import clsx from 'clsx';

const PERIODS: Period[] = ['1w', '1m', '3m'];

export default function PeriodTabs({
  active,
  onChange,
  disabled,
}: {
  active: Period;
  onChange: (p: Period) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-full border border-gray-200 bg-gray-100">
      {PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => !disabled && onChange(p)}
          disabled={disabled}
          className={clsx(
            'px-5 py-2 rounded-full text-sm font-semibold transition-all duration-250',
            active === p
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
              : 'text-gray-400 hover:text-gray-700',
            disabled && 'opacity-40 cursor-not-allowed',
          )}
        >
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );
}
