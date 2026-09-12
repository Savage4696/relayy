import React from 'react';
import { Send, BrainCircuit, MessageSquarePlus, Play } from 'lucide-react';

interface ActionPanelProps {
  onRunAnalysis: () => void;
  onSendSlackUpdate: () => void;
  onOpenSlackSimModal: () => void;
  isAnalyzing: boolean;
  isSendingSlack: boolean;
  slackMessageSent: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  onRunAnalysis,
  onSendSlackUpdate,
  onOpenSlackSimModal,
  isAnalyzing,
  isSendingSlack,
  slackMessageSent,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Play className="w-4 h-4 text-cyan-400" />
          Agent Action Controls
        </h3>
        <span className="text-xs text-slate-400">Execute Autonomous Feedback Loop</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <BrainCircuit className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing Evidence...' : '1. Run Agent Reasoning'}
        </button>

        <button
          onClick={onSendSlackUpdate}
          disabled={isSendingSlack}
          className={`p-3.5 rounded-xl font-semibold text-xs transition border flex items-center justify-center gap-2 disabled:opacity-50 ${
            slackMessageSent
              ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-300'
              : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
          }`}
        >
          <Send className={`w-4 h-4 ${isSendingSlack ? 'animate-pulse' : ''}`} />
          {isSendingSlack
            ? 'Posting to Slack...'
            : slackMessageSent
            ? '✓ Slack Update Sent!'
            : '2. Send Contextual Slack Update'}
        </button>

        <button
          onClick={onOpenSlackSimModal}
          className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2"
        >
          <MessageSquarePlus className="w-4 h-4 text-cyan-400" />
          Simulate Slack Message
        </button>
      </div>
    </div>
  );
};
