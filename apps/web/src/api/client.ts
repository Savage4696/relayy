export interface Task {
  id: string;
  title: string;
  description?: string;
  owner?: string;
  status: string;
  deadline?: string;
  entity?: string;
  topic?: string;
  confidence?: number;
  created_at: string;
  updated_at: string;
}

export interface ContextEvent {
  id: string;
  task_id: string;
  source: 'slack' | 'browser' | 'system' | 'user';
  source_id?: string;
  event_type: string;
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
  relevance_score: number;
  created_at: string;
  snippet?: string;
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

export interface TaskContextSummary {
  task: Task;
  events: ContextEvent[];
  evidence: Evidence[];
  latest_action?: AgentAction | null;
}

const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch('/health');
    return res.json();
  },

  async getActiveContext(): Promise<{ count: number; tasks: TaskContextSummary[] }> {
    const res = await fetch(`${API_BASE}/context/active`);
    if (!res.ok) throw new Error('Failed to fetch active context');
    return res.json();
  },

  async runAnalysis(taskId: string): Promise<{ success: boolean; analysis: any }> {
    const res = await fetch(`${API_BASE}/context/task/${taskId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  },

  async sendSlackUpdate(taskId: string, payload?: any): Promise<any> {
    const res = await fetch(`${API_BASE}/context/task/${taskId}/slack-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (!res.ok) throw new Error('Failed to send Slack update');
    return res.json();
  },

  async simulateSlackMessage(messages: { author: string; content: string }[]): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/slack-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error('Failed to simulate Slack message');
    return res.json();
  },

  async resetDemo(): Promise<{ success: boolean; active_task: TaskContextSummary }> {
    const res = await fetch(`${API_BASE}/demo/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to reset demo state');
    return res.json();
  },
};
