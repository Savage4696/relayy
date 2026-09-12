import { Router, Request, Response } from 'express';
import { contextEngine } from '../services/contextEngine.js';
import { db } from '../db/database.js';

export const demoRouter = Router();

// POST /api/demo/slack-message
demoRouter.post('/slack-message', async (req: Request, res: Response) => {
  const { messages, author, content } = req.body;

  let msgList: { author: string; content: string }[] = [];

  if (Array.isArray(messages)) {
    msgList = messages;
  } else if (author && content) {
    msgList = [{ author, content }];
  } else {
    // Default golden path Slack scenario
    msgList = [
      { author: 'Alex', content: "Acme's API authentication is failing." },
      { author: 'Krishna', content: "I'll investigate the OAuth issue." },
      { author: 'Sarah', content: 'We need this fixed before Friday.' },
      { author: 'Alex', content: "Their docs mention they've changed their OAuth flow." },
    ];
  }

  try {
    const summary = await contextEngine.ingestSlackMessages(msgList);
    res.json({
      success: true,
      message: `Ingested ${msgList.length} Slack messages successfully`,
      active_task: summary,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Slack message ingestion failed' });
  }
});

// POST /api/demo/reset
demoRouter.post('/reset', (req: Request, res: Response) => {
  const seed = db.seedDemoState();
  const summary = contextEngine.getTaskContext(seed.task.id);

  res.json({
    success: true,
    message: 'Demo state reset successfully. Acme OAuth task recreated.',
    active_task: summary,
  });
});
