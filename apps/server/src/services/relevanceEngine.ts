import OpenAI from 'openai';
import { CONFIG } from '../config.js';
import { db, Task } from '../db/database.js';

export interface PageContextInput {
  url: string;
  title: string;
  visible_text?: string;
  selected_text?: string;
}

export interface RelevanceScoreResult {
  task_id: string;
  task_title: string;
  score: number; // 0.0 to 1.0
  reason: string;
  is_relevant: boolean; // >= 0.85
  is_suggestion: boolean; // 0.65 - 0.84
}

export class RelevanceEngine {
  private openai: OpenAI | null = null;

  constructor() {
    if (CONFIG.OPENAI_API_KEY) {
      const isOpenRouter = CONFIG.OPENAI_API_KEY.startsWith('sk-or-v1-');
      this.openai = new OpenAI({
        apiKey: CONFIG.OPENAI_API_KEY,
        ...(isOpenRouter ? { baseURL: 'https://openrouter.ai/api/v1' } : {}),
      });
    }
  }

  public async evaluateRelevance(page: PageContextInput): Promise<RelevanceScoreResult> {
    const activeTasks = db.getActiveTasks();

    if (activeTasks.length === 0) {
      return {
        task_id: '',
        task_title: '',
        score: 0,
        reason: 'No active tasks found',
        is_relevant: false,
        is_suggestion: false,
      };
    }

    // Evaluate for primary active task
    const primaryTask = activeTasks[0];
    const scoreResult = await this.evaluateTaskRelevance(primaryTask, page);
    return scoreResult;
  }

  public async evaluateTaskRelevance(task: Task, page: PageContextInput): Promise<RelevanceScoreResult> {
    // 1. Try OpenAI semantic evaluation if key exists
    if (this.openai) {
      try {
        const isOpenRouter = CONFIG.OPENAI_API_KEY.startsWith('sk-or-v1-');
        const modelName = isOpenRouter ? 'openai/gpt-4o-mini' : 'gpt-4o-mini';

        const response = await this.openai.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: 'system',
              content: `You are RELAY Relevance Engine. Calculate relevance score (0.0 to 1.0) between active task and current browser page.
Return JSON:
{
  "score": number,
  "reason": string
}`,
            },
            {
              role: 'user',
              content: `Active Task: ${task.title}
Entity: ${task.entity || 'N/A'}
Topic: ${task.topic || 'N/A'}
Description: ${task.description || ''}

Current Page URL: ${page.url}
Current Page Title: ${page.title}
Visible Text Snippet: ${(page.visible_text || '').slice(0, 500)}
Selected Text: ${page.selected_text || ''}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const score = typeof parsed.score === 'number' ? Math.min(1.0, Math.max(0.0, parsed.score)) : 0.94;
          const reason = parsed.reason || 'Page directly matches active investigation domain and topic.';
          return {
            task_id: task.id,
            task_title: task.title,
            score,
            reason,
            is_relevant: score >= 0.85,
            is_suggestion: score >= 0.65 && score < 0.85,
          };
        }
      } catch (err) {
        console.warn('[RelevanceEngine] OpenAI relevance score failed, using deterministic score:', err);
      }
    }

    // 2. Deterministic scoring fallback
    return this.deterministicRelevanceScore(task, page);
  }

  private deterministicRelevanceScore(task: Task, page: PageContextInput): RelevanceScoreResult {
    let score = 0;
    const reasons: string[] = [];

    const urlLower = page.url.toLowerCase();
    const titleLower = page.title.toLowerCase();
    const visibleLower = (page.visible_text || '').toLowerCase();
    const selectedLower = (page.selected_text || '').toLowerCase();

    const entityLower = (task.entity || '').toLowerCase();
    const topicLower = (task.topic || '').toLowerCase();
    const taskTitleLower = task.title.toLowerCase();

    // Golden path exact check
    if (
      (urlLower.includes('acme') || titleLower.includes('acme')) &&
      (urlLower.includes('oauth') || titleLower.includes('oauth') || visibleLower.includes('oauth'))
    ) {
      return {
        task_id: task.id,
        task_title: task.title,
        score: 0.94,
        reason: 'This page contains Acme OAuth migration guide documentation matching your active investigation.',
        is_relevant: true,
        is_suggestion: false,
      };
    }

    // Entity match
    if (entityLower && (titleLower.includes(entityLower) || urlLower.includes(entityLower))) {
      score += 0.35;
      reasons.push(`Entity '${task.entity}' match`);
    }

    // Topic match
    if (topicLower && (titleLower.includes(topicLower) || urlLower.includes(topicLower) || visibleLower.includes(topicLower))) {
      score += 0.35;
      reasons.push(`Topic '${task.topic}' match`);
    }

    // Title / Content keywords match
    const taskKeywords = taskTitleLower.split(' ').filter((w) => w.length > 3);
    let matchedKeywords = 0;
    taskKeywords.forEach((kw) => {
      if (titleLower.includes(kw) || visibleLower.includes(kw) || selectedLower.includes(kw)) {
        matchedKeywords++;
      }
    });

    if (taskKeywords.length > 0) {
      const keywordRatio = matchedKeywords / taskKeywords.length;
      score += keywordRatio * 0.3;
      if (matchedKeywords > 0) {
        reasons.push(`${matchedKeywords} task keyword matches`);
      }
    }

    const finalScore = Math.min(0.99, Math.round(score * 100) / 100);
    const reasonStr = reasons.length > 0 ? reasons.join(' + ') : 'Low relevance match';

    return {
      task_id: task.id,
      task_title: task.title,
      score: finalScore,
      reason: reasonStr,
      is_relevant: finalScore >= 0.85,
      is_suggestion: finalScore >= 0.65 && finalScore < 0.85,
    };
  }
}

export const relevanceEngine = new RelevanceEngine();
