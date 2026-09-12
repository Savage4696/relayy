import React from 'react';
import { ContextEvent } from '../api/client';
import { MessageSquare, Bot, User, Cpu, Sparkles } from 'lucide-react';

interface ContextTimelineProps {
  events: ContextEvent[];
}

export const ContextTimeline: React.FC<ContextTimelineProps> = ({ events }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Slack Work Context Timeline
          </h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
          {events.length} Events
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1 flex-1">
        {events.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">No context events ingested yet.</div>
        ) : (
          events.map((ev) => {
            const isSystem = ev.source === 'system' || ev.event_type === 'system_action';
            const author = ev.author || (isSystem ? 'RELAY Bot' : 'Slack User');

            return (
              <div
                key={ev.id}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed transition ${
                  isSystem
                    ? 'bg-cyan-950/30 border-cyan-800/60 text-cyan-100 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-semibold">
                    {isSystem ? (
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        {author}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {author}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="whitespace-pre-wrap font-sans text-slate-300">
                  {ev.content}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
