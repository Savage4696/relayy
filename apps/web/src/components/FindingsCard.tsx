import React from 'react';
import { AgentAction } from '../api/client';
import { BrainCircuit, ArrowRight, ShieldCheck, CheckCircle, Lightbulb, AlertTriangle } from 'lucide-react';

interface FindingsCardProps {
  action: AgentAction | null | undefined;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
}

export const FindingsCard: React.FC<FindingsCardProps> = ({ action, isAnalyzing, onRunAnalysis }) => {
  const confidencePct = action ? Math.round(action.confidence * 100) : 91;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Agent Reasoning & Findings
          </h3>
        </div>

        {action && (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Confidence: {confidencePct}%
          </span>
        )}
      </div>

      {!action ? (
        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 text-center">
          <Lightbulb className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-80" />
          <p className="text-xs text-slate-300 mb-4">
            No agent reasoning run on captured evidence yet.
          </p>
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            <BrainCircuit className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing Evidence...' : 'Run Agent Analysis'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-cyan-950/20 rounded-xl p-4 border border-cyan-800/40">
            <div className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Finding
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">{action.finding}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
              <div className="font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Impact
              </div>
              <p className="text-slate-300 leading-relaxed">{action.impact}</p>
            </div>

            <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
              <div className="font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4" /> Recommended Next Step
              </div>
              <p className="text-slate-300 leading-relaxed">{action.recommended_action}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
