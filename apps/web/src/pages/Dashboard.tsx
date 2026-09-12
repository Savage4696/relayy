import React from 'react';
import { TaskContextSummary } from '../api/client';
import { ActiveWorkCard } from '../components/ActiveWorkCard';
import { ContextTimeline } from '../components/ContextTimeline';
import { EvidenceList } from '../components/EvidenceList';
import { FindingsCard } from '../components/FindingsCard';
import { ActionPanel } from '../components/ActionPanel';

interface DashboardProps {
  activeContext: TaskContextSummary | null;
  isAnalyzing: boolean;
  isSendingSlack: boolean;
  slackMessageSent: boolean;
  onRunAnalysis: () => void;
  onSendSlackUpdate: () => void;
  onOpenSlackSimModal: () => void;
  onSimulateAddEvidence: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activeContext,
  isAnalyzing,
  isSendingSlack,
  slackMessageSent,
  onRunAnalysis,
  onSendSlackUpdate,
  onOpenSlackSimModal,
  onSimulateAddEvidence,
}) => {
  const task = activeContext?.task || null;
  const events = activeContext?.events || [];
  const evidence = activeContext?.evidence || [];
  const latestAction = activeContext?.latest_action;

  return (
    <div className="space-y-6">
      {/* Active Work Card Banner */}
      <ActiveWorkCard task={task} />

      {/* Action Control Panel */}
      <ActionPanel
        onRunAnalysis={onRunAnalysis}
        onSendSlackUpdate={onSendSlackUpdate}
        onOpenSlackSimModal={onOpenSlackSimModal}
        isAnalyzing={isAnalyzing}
        isSendingSlack={isSendingSlack}
        slackMessageSent={slackMessageSent}
      />

      {/* Main Grid: Slack Context Timeline & Browser Evidence List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContextTimeline events={events} />
        <EvidenceList evidence={evidence} onSimulateAddEvidence={onSimulateAddEvidence} />
      </div>

      {/* Agent Findings & Next Steps */}
      <FindingsCard
        action={latestAction}
        isAnalyzing={isAnalyzing}
        onRunAnalysis={onRunAnalysis}
      />
    </div>
  );
};
