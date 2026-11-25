import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'improved';
  icon?: LucideIcon;
  description?: string;
  highlight?: boolean;
  tag?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
  highlight = false,
  tag
}) => {
  const changeColor = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    negative: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    improved: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    neutral: 'text-slate-400 bg-slate-800/50 border-slate-700/50'
  }[changeType];

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:translate-y-[-2px] ${
        highlight
          ? 'glass-panel-glow border-cyan-500/40 bg-gradient-to-b from-navy-900/90 to-navy-950/90'
          : 'glass-panel bg-navy-900/60 hover:border-slate-600/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-cyan-400 font-mono">
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="p-2.5 rounded-lg bg-navy-800/80 border border-slate-700/60 text-cyan-400 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
        {change ? (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${changeColor}`}>
            {change}
          </span>
        ) : tag ? (
          <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/40">
            {tag}
          </span>
        ) : null}

        {description && (
          <span className="text-slate-400 truncate text-[11px]" title={description}>
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
