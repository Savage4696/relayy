import { Router, Request, Response } from 'express';
import { contextEngine } from '../services/contextEngine.js';
import { relevanceEngine } from '../services/relevanceEngine.js';
import { openAiAgent } from '../services/openAiAgent.js';
import { slackService } from '../services/slackService.js';
import { db } from '../db/database.js';

export const contextRouter = Router();

// GET /api/context/active
contextRouter.get('/active', (req: Request, res: Response) => {
  const activeTasks = contextEngine.getActiveTasks();
  const activeSummaries = activeTasks
    .map((t) => contextEngine.getTaskContext(t.id))
    .filter(Boolean);

  res.json({
    count: activeSummaries.length,
    tasks: activeSummaries,
  });
});

// GET /api/context/task/:taskId
contextRouter.get('/task/:taskId', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const summary = contextEngine.getTaskContext(taskId);
  if (!summary) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(summary);
});

// POST /api/context/task
contextRouter.post('/task', (req: Request, res: Response) => {
  const taskData = req.body;
  if (!taskData.title) {
    return res.status(400).json({ error: 'Task title is required' });
  }
  const task = contextEngine.createTask(taskData);
  res.status(201).json(task);
});

// POST /api/context/task/:taskId/evidence
contextRouter.post('/task/:taskId/evidence', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { url, title, content, relevance_score, snippet } = req.body;

  if (!url || !title) {
    return res.status(400).json({ error: 'Evidence URL and title are required' });
  }

  const evidence = contextEngine.addEvidence(taskId, {
    url,
    title,
    content: content || '',
    relevance_score: typeof relevance_score === 'number' ? relevance_score : 0.94,
    snippet,
  });

  res.status(201).json({
    message: 'Evidence added successfully',
    evidence,
  });
});

// POST /api/context/task/:taskId/analyze
contextRouter.post('/task/:taskId/analyze', async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    const analysis = await openAiAgent.analyze(taskId);
    res.json({
      success: true,
      analysis,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

// POST /api/context/task/:taskId/slack-update
contextRouter.post('/task/:taskId/slack-update', async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { finding, recommendedAction, confidence } = req.body;

  const latestAction = db.getLatestAgentAction(taskId);

  const payload = {
    taskId,
    finding: finding || (latestAction?.finding) || 'The new OAuth flow changes token handling and may explain the current authentication failure.',
    recommendedAction: recommendedAction || (latestAction?.recommended_action) || 'Review the token refresh implementation against the new OAuth flow.',
    confidence: typeof confidence === 'number' ? confidence : (latestAction?.confidence ?? 0.91),
  };

  try {
    const result = await slackService.postContextUpdate(payload);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Slack update failed' });
  }
});

// POST /api/context/relevance
contextRouter.post('/relevance', async (req: Request, res: Response) => {
  const { url, title, visible_text, selected_text } = req.body;
  if (!url || !title) {
    return res.status(400).json({ error: 'URL and page title are required' });
  }

  try {
    const relevance = await relevanceEngine.evaluateRelevance({
      url,
      title,
      visible_text,
      selected_text,
    });
    res.json(relevance);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Relevance calculation failed' });
  }
});
