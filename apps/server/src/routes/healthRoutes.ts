import { Router, Request, Response } from 'express';
import { CONFIG } from '../config.js';

export const healthRouter = Router();

healthRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    demo_mode: CONFIG.DEMO_MODE,
    openai_configured: Boolean(CONFIG.OPENAI_API_KEY),
    exa_configured: Boolean(CONFIG.EXA_API_KEY),
    slack_configured: Boolean(CONFIG.SLACK_BOT_TOKEN || CONFIG.SLACK_APP_TOKEN),
    supabase_configured: Boolean(CONFIG.SUPABASE_URL),
  });
});
