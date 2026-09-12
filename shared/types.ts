export type TaskStatus = 'Investigating' | 'In Progress' | 'Blocked' | 'Completed' | 'Pending';

export interface Task {
  id: string;
  title: string;
  description?: string;
  owner?: string;
  status: TaskStatus;
  deadline?: string;
  workspace_id?: string;
  created_at: string;
  updated_at: string;
  entity?: string;
  topic?: string;
  confidence?: number;
}

export interface ContextEvent {
  id: string;
  task_id: string;
  source: 'slack' | 'browser' | 'system' | 'user';
  source_id?: string;
  event_type: 'message' | 'decision' | 'commitment' | 'page_view' | 'system_action';
  content: string;
  author?: string;
  timestamp: string;
}

export interface Evidence {
  id: string;
  task_id: string;
  url: string;
  title: string;
  content: string;
  relevance_score: number; // 0.0 to 1.0
  created_at: string;
  snippet?: string;
}

export interface Entity {
  id: string;
  name: string;
  type: string; // e.g., 'company', 'technology', 'protocol', 'person'
}

export interface AgentAction {
  id: string;
  task_id: string;
  action: string;
  finding?: string;
  impact?: string;
  recommended_action?: string;
  confidence: number;
  approved: boolean;
  created_at: string;
}

export interface StructuredTaskExtraction {
  task: string;
  owner: string;
  deadline: string;
  entity: string;
  topic: string;
  status: TaskStatus;
  confidence: number;
}

export interface RelevanceScoreResult {
  task_id: string;
  task_title: string;
  score: number; // 0.0 to 1.0
  reason: string;
  is_relevant: boolean; // >= 0.85 threshold
  is_suggestion: boolean; // 0.65 - 0.84 threshold
}

export interface AgentAnalysisResult {
  finding: string;
  impact: string;
  recommended_action: string;
  confidence: number;
  slack_message?: string;
}

export interface TaskContextSummary {
  task: Task;
  events: ContextEvent[];
  evidence: Evidence[];
  latest_action?: AgentAction;
}

export interface DemoResetResponse {
  success: boolean;
  message: string;
  active_task: TaskContextSummary;
}
