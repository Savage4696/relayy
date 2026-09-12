import { db, Task, ContextEvent, Evidence, AgentAction } from '../db/database.js';
import { extractionService } from './extractionService.js';

export interface TaskContextSummary {
  task: Task;
  events: ContextEvent[];
  evidence: Evidence[];
  latest_action: AgentAction | null;
}

export class ContextEngine {
  public createTask(data: Partial<Task>): Task {
    return db.createTask(data);
  }

  public updateTask(taskId: string, updates: Partial<Task>): Task | null {
    return db.updateTask(taskId, updates);
  }

  public getActiveTasks(): Task[] {
    return db.getActiveTasks();
  }

  public getTaskContext(taskId: string): TaskContextSummary | null {
    const task = db.getTask(taskId);
    if (!task) return null;

    const events = db.getContextEvents(taskId);
    const evidence = db.getEvidence(taskId);
    const latest_action = db.getLatestAgentAction(taskId);

    return {
      task,
      events,
      evidence,
      latest_action,
    };
  }

  public searchContext(query: string): ContextEvent[] {
    const q = query.toLowerCase();
    return db.getAllTasks().flatMap((t) =>
      db.getContextEvents(t.id).filter((e) => e.content.toLowerCase().includes(q))
    );
  }

  public addEvidence(taskId: string, data: Partial<Evidence>): Evidence {
    return db.addEvidence({ ...data, task_id: taskId });
  }

  public recordAgentAction(data: Partial<AgentAction>): AgentAction {
    return db.recordAgentAction(data);
  }

  public async ingestSlackMessages(messages: { author: string; content: string }[]): Promise<TaskContextSummary> {
    const fullText = messages.map((m) => `${m.author}: "${m.content}"`).join('\n');
    
    // Extract structured task attributes
    const extracted = await extractionService.extractFromMessages(fullText);

    // Get or create active task
    let activeTasks = db.getActiveTasks();
    let task: Task;

    if (activeTasks.length > 0) {
      task = db.updateTask(activeTasks[0].id, {
        title: extracted.task,
        owner: extracted.owner,
        deadline: extracted.deadline,
        entity: extracted.entity,
        topic: extracted.topic,
        status: extracted.status,
        confidence: extracted.confidence,
      })!;
    } else {
      task = db.createTask({
        title: extracted.task,
        owner: extracted.owner,
        deadline: extracted.deadline,
        entity: extracted.entity,
        topic: extracted.topic,
        status: extracted.status,
        confidence: extracted.confidence,
      });
    }

    // Persist messages as context events
    messages.forEach((m, i) => {
      db.addContextEvent({
        task_id: task.id,
        source: 'slack',
        source_id: `slack-${Date.now()}-${i}`,
        event_type: 'message',
        author: m.author,
        content: `${m.author}: "${m.content}"`,
        timestamp: new Date().toISOString(),
      });
    });

    return this.getTaskContext(task.id)!;
  }
}

export const contextEngine = new ContextEngine();
