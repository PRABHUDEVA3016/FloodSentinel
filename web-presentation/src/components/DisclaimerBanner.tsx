import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface DisclaimerBannerProps {
  type?: 'warning' | 'info' | 'verified';
  title: string;
  message: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  type = 'info',
  title,
  message
}) => {
  const styles = {
    warning: {
      border: 'border-amber-500/30 bg-amber-950/20 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
      badge: 'Scientific Disclaimer'
    },
    info: {
      border: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-200',
      icon: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
      badge: 'Methodological Context'
    },
    verified: {
      border: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
      badge: 'Verified Analytical Output'
    }
  }[type];

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-sm flex items-start gap-3.5 my-4 ${styles.border}`}>
      {styles.icon}
      <div className="space-y-1 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide">{title}</span>
          <span className="px-1.5 py-0.5 text-[10px] font-mono rounded uppercase bg-slate-900/60 border border-slate-700/50 text-slate-300">
            {styles.badge}
          </span>
        </div>
        <p className="text-slate-300/90 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};
