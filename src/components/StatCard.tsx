import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'blue' | 'rose' | 'amber' | 'emerald';
  icon?: React.ReactNode;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  badgeVariant = 'blue',
  icon,
  highlight = false,
}) => {
  const badgeClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/90 font-bold',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  }[badgeVariant];

  return (
    <div
      className={`glass-panel p-5 rounded-xl border transition-all duration-200 ${
        highlight
          ? 'ring-2 ring-rose-400/50 bg-rose-50/20 shadow-md'
          : 'hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-balance">
          {title}
        </span>
        {icon && <div className="text-slate-400 flex-shrink-0 p-1.5 rounded-lg bg-slate-50 border border-slate-100">{icon}</div>}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2.5">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
          {value}
        </span>
        {badge && (
          <span className={`text-xs px-2 py-0.5 rounded-md border tabular-nums ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 text-pretty leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
