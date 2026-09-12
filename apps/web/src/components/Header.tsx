import React from 'react';
import { RefreshCw, ExternalLink, Activity, Layers, Sparkles } from 'lucide-react';

interface HeaderProps {
  onResetDemo: () => void;
  isResetting: boolean;
  onNavigateDemo: () => void;
  currentPath: string;
}

export const Header: React.FC<HeaderProps> = ({
  onResetDemo,
  isResetting,
  onNavigateDemo,
  currentPath,
}) => {
  const isDashboard = currentPath === '/';

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">RELAY</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Work Memory Layer
              </span>
            </div>
            <p className="text-xs text-slate-400">
              "Your work moves. Your context comes with it." • <span className="text-slate-300">AI Tinkerers Hackathon 2026</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateDemo}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition flex items-center gap-2 ${
              !isDashboard
                ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {isDashboard ? 'Open Demo Acme Docs Page' : 'Return to RELAY Dashboard'}
          </button>

          <button
            onClick={onResetDemo}
            disabled={isResetting}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/60 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            Reset Demo State
          </button>

          <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
