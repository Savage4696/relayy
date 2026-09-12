import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CONFIG } from '../config.js';

export type TaskStatus = 'Investigating' | 'In Progress' | 'Blocked' | 'Completed' | 'Pending';

export interface Task {
  id: string;
  title: string;
  description?: string;
  owner?: string;
  status: TaskStatus;
  deadline?: string;
  workspace_id?: string;
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
  relevance_score: number;
  created_at: string;
  snippet?: string;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
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

class Database {
  private tasks: Map<string, Task> = new Map();
  private contextEvents: Map<string, ContextEvent> = new Map();
  private evidenceItems: Map<string, Evidence> = new Map();
  private entities: Map<string, Entity> = new Map();
  private agentActions: Map<string, AgentAction> = new Map();
  private supabase: SupabaseClient | null = null;

  constructor() {
    const key = CONFIG.SUPABASE_SERVICE_ROLE_KEY || CONFIG.SUPABASE_ANON_KEY;
    if (CONFIG.SUPABASE_URL && key) {
      try {
        this.supabase = createClient(CONFIG.SUPABASE_URL, key);
        console.log('[Database] Supabase admin client initialized for remote sync.');
      } catch (err) {
        console.warn('[Database] Failed to initialize Supabase client:', err);
      }
    }
    this.seedDemoState();
  }

  public clearAll(): void {
    this.tasks.clear();
    this.contextEvents.clear();
    this.evidenceItems.clear();
    this.entities.clear();
    this.agentActions.clear();
  }

  public createTask(data: Partial<Task>): Task {
    const id = data.id || crypto.randomUUID();
    const now = new Date().toISOString();
    const task: Task = {
      id,
      title: data.title || 'Untitled Task',
      description: data.description || '',
      owner: data.owner || 'Unassigned',
      status: data.status || 'Investigating',
      deadline: data.deadline || 'ASAP',
      workspace_id: data.workspace_id || 'default-workspace',
      entity: data.entity || '',
      topic: data.topic || '',
      confidence: data.confidence ?? 0.9,
      created_at: data.created_at || now,
      updated_at: now,
    };
    this.tasks.set(id, task);

    if (this.supabase) {
      this.supabase
        .from('tasks')
        .upsert([task])
        .then(({ error }) => {
          if (error) console.warn('[Supabase Sync] Task upsert warning:', error.message);
        });
    }

    return task;
  }

  public async createTaskAsync(data: Partial<Task>): Promise<Task> {
    const task = this.createTask(data);
    if (this.supabase) {
      await this.supabase.from('tasks').upsert([task]);
    }
    return task;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const existing = this.tasks.get(id);
    if (!existing) return null;
    const updated: Task = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.tasks.set(id, updated);

    if (this.supabase) {
      this.supabase
        .from('tasks')
        .update(updated)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('[Supabase Sync] Task update warning:', error.message);
        });
    }

    return updated;
  }

  public getTask(id: string): Task | null {
    return this.tasks.get(id) || null;
  }

  public getActiveTasks(): Task[] {
    return Array.from(this.tasks.values()).filter(
      (t) => t.status === 'Investigating' || t.status === 'In Progress'
    );
  }

  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  public addContextEvent(data: Partial<ContextEvent>): ContextEvent {
    const id = data.id || crypto.randomUUID();
    const event: ContextEvent = {
      id,
      task_id: data.task_id || '',
      source: data.source || 'slack',
      source_id: data.source_id || '',
      event_type: data.event_type || 'message',
      content: data.content || '',
      author: data.author || 'User',
      timestamp: data.timestamp || new Date().toISOString(),
    };
    this.contextEvents.set(id, event);

    if (this.supabase) {
      this.supabase
        .from('context_events')
        .upsert([event])
        .then(({ error }) => {
          if (error) console.warn('[Supabase Sync] Event upsert warning:', error.message);
        });
    }

    return event;
  }

  public getContextEvents(taskId: string): ContextEvent[] {
    return Array.from(this.contextEvents.values())
      .filter((e) => e.task_id === taskId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public addEvidence(data: Partial<Evidence>): Evidence {
    // Check duplicate by URL
    const existing = Array.from(this.evidenceItems.values()).find(
      (e) => e.task_id === data.task_id && e.url === data.url
    );
    if (existing) {
      return existing;
    }

    const id = data.id || crypto.randomUUID();
    const evidenceItem: Evidence = {
      id,
      task_id: data.task_id || '',
      url: data.url || '',
      title: data.title || 'Untitled Document',
      content: data.content || '',
      relevance_score: data.relevance_score ?? 0.94,
      created_at: data.created_at || new Date().toISOString(),
      snippet: data.snippet || (data.content ? data.content.slice(0, 180) + '...' : ''),
    };
    this.evidenceItems.set(id, evidenceItem);

    if (this.supabase) {
      this.supabase
        .from('evidence')
        .upsert([{
          id: evidenceItem.id,
          task_id: evidenceItem.task_id,
          url: evidenceItem.url,
          title: evidenceItem.title,
          content: evidenceItem.content,
          relevance_score: evidenceItem.relevance_score,
          created_at: evidenceItem.created_at,
        }])
        .then(({ error }) => {
          if (error) console.warn('[Supabase Sync] Evidence upsert warning:', error.message);
        });
    }

    return evidenceItem;
  }

  public getEvidence(taskId: string): Evidence[] {
    return Array.from(this.evidenceItems.values())
      .filter((e) => e.task_id === taskId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public recordAgentAction(data: Partial<AgentAction>): AgentAction {
    const id = data.id || crypto.randomUUID();
    const action: AgentAction = {
      id,
      task_id: data.task_id || '',
      action: data.action || 'Analysis Completed',
      finding: data.finding || '',
      impact: data.impact || '',
      recommended_action: data.recommended_action || '',
      confidence: data.confidence ?? 0.91,
      approved: data.approved ?? true,
      created_at: new Date().toISOString(),
    };
    this.agentActions.set(id, action);

    if (this.supabase) {
      this.supabase
        .from('agent_actions')
        .upsert([action])
        .then(({ error }) => {
          if (error) console.warn('[Supabase Sync] Action upsert warning:', error.message);
        });
    }

    return action;
  }

  public getLatestAgentAction(taskId: string): AgentAction | null {
    const actions = Array.from(this.agentActions.values())
      .filter((a) => a.task_id === taskId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return actions[0] || null;
  }

  public seedDemoState(): { task: Task; events: ContextEvent[] } {
    this.clearAll();

    const taskId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    const task = this.createTask({
      id: taskId,
      title: 'Investigate Acme OAuth authentication issue',
      description: 'Acme API authentication failing following documented OAuth flow migration.',
      owner: 'Krishna',
      status: 'Investigating',
      deadline: 'Friday',
      entity: 'Acme',
      topic: 'OAuth',
      confidence: 0.91,
    });

    const messages = [
      { author: 'Alex', content: "Acme's API authentication is failing." },
      { author: 'Krishna', content: "I'll investigate the OAuth issue." },
      { author: 'Sarah', content: 'We need this fixed before Friday.' },
      { author: 'Alex', content: "Their docs mention they've changed their OAuth flow." },
    ];

    const events: ContextEvent[] = [];
    const baseTime = Date.now() - 3600000;
    messages.forEach((m, idx) => {
      const ev = this.addContextEvent({
        task_id: taskId,
        source: 'slack',
        source_id: `slack-msg-${idx + 1}`,
        event_type: 'message',
        author: m.author,
        content: `${m.author}: "${m.content}"`,
        timestamp: new Date(baseTime + idx * 60000).toISOString(),
      });
      events.push(ev);
    });

    return { task, events };
  }
}

export const db = new Database();
