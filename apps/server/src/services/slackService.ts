import { CONFIG } from '../config.js';
import { db } from '../db/database.js';

export interface SlackUpdatePayload {
  taskId: string;
  finding: string;
  recommendedAction: string;
  confidence: number;
}

export class SlackService {
  private botToken: string;

  constructor() {
    this.botToken = CONFIG.SLACK_BOT_TOKEN;
  }

  public async postContextUpdate(payload: SlackUpdatePayload): Promise<{ success: boolean; message: string; formattedMessage: string }> {
    const task = db.getTask(payload.taskId);
    const taskTitle = task ? task.title : 'Acme OAuth investigation';
    const confidencePct = Math.round(payload.confidence * 100);

    const formattedMessage = `RELAY — ${taskTitle} updated.\n\nFinding:\n${payload.finding}\n\nNext step:\n${payload.recommendedAction}\n\nConfidence: ${confidencePct}%`;

    // 1. Always record in local DB as a context event so the UI displays it immediately
    const contextEvent = db.addContextEvent({
      task_id: payload.taskId,
      source: 'system',
      source_id: `relay-update-${Date.now()}`,
      event_type: 'system_action',
      author: 'RELAY Bot',
      content: formattedMessage,
      timestamp: new Date().toISOString(),
    });

    // 2. Post to real Slack API if bot token exists
    if (this.botToken) {
      try {
        const response = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.botToken}`,
          },
          body: JSON.stringify({
            channel: '#general',
            text: formattedMessage,
          }),
        });

        const data = (await response.json()) as any;
        if (data.ok) {
          console.log('[SlackService] Successfully sent Slack message to API.');
          return { success: true, message: 'Message posted to Slack API', formattedMessage };
        } else {
          console.warn('[SlackService] Slack API error response:', data.error);
        }
      } catch (err) {
        console.warn('[SlackService] Failed to post to Slack API, falling back to demo mode:', err);
      }
    }

    console.log('[SlackService] Demo mode: Slack update logged locally:\n', formattedMessage);
    return {
      success: true,
      message: 'Slack update generated & stored in demo mode',
      formattedMessage,
    };
  }
}

export const slackService = new SlackService();
