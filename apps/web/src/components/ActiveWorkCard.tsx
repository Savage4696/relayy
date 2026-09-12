import React from 'react';
import { Task } from '../api/client';
import { CheckCircle2, Clock, User, Tag, Building2, ShieldCheck, Flame } from 'lucide-react';

interface ActiveWorkCardProps {
  task: Task | null;
}

export const ActiveWorkCard: React.FC<ActiveWorkCardProps> = ({ task }) => {
  if (!task) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center py-12 text-slate-400">
        No active work item identified yet.
      </div>
    );
  }

  const confidencePct = Math.round((task.confidence || 0.91) * 100);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 accent-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            Active Work State
          </span>
          <span className="text-xs text-slate-400 font-mono">ID: {task.id.slice(0, 8)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {task.status}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {confidencePct}% Confidence
          </span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2 leading-snug">{task.title}</h2>
      {task.description && (
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">{task.description}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-400 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-cyan-400" /> Owner
          </div>
          <div className="font-semibold text-slate-200">{task.owner || 'Unassigned'}</div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-400 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Deadline
          </div>
          <div className="font-semibold text-slate-200">{task.deadline || 'ASAP'}</div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-400 mb-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Entity
          </div>
          <div className="font-semibold text-cyan-300">{task.entity || 'Acme'}</div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-400 mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-cyan-400" /> Topic
          </div>
          <div className="font-semibold text-slate-200">{task.topic || 'OAuth'}</div>
        </div>
      </div>
    </div>
  );
};
