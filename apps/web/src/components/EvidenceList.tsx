import React from 'react';
import { Evidence } from '../api/client';
import { Compass, ExternalLink, ShieldCheck, FileText, Plus } from 'lucide-react';

interface EvidenceListProps {
  evidence: Evidence[];
  onSimulateAddEvidence: () => void;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({ evidence, onSimulateAddEvidence }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Browser Evidence Captured
          </h3>
        </div>

        <button
          onClick={onSimulateAddEvidence}
          className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/80 transition flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Capture Demo Page Evidence
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1 flex-1">
        {evidence.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 p-4">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No browser evidence captured yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Open the Acme OAuth Migration documentation page or click above to capture evidence.
            </p>
          </div>
        ) : (
          evidence.map((item) => {
            const matchPct = Math.round(item.relevance_score * 100);

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition group"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 flex items-center gap-1 hover:underline"
                  >
                    {item.title}
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <span className="shrink-0 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {matchPct}% Match
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 truncate mb-2">{item.url}</div>

                {item.snippet && (
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-sans">
                    "{item.snippet}"
                  </p>
                )}

                <div className="mt-2 text-[10px] text-slate-500 text-right font-mono">
                  Captured {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
