import { Router, Request, Response } from 'express';
import { contextEngine } from '../services/contextEngine.js';

export const slackRouter = Router();

slackRouter.post('/events/slack', async (req: Request, res: Response) => {
  const body = req.body;

  // 1. Slack Events API url_verification handshake
  if (body?.type === 'url_verification') {
    return res.status(200).send(body.challenge);
  }

  // 2. Filter out bot messages / self-messages (Page 9)
  if (body?.event) {
    const event = body.event;
    if (event.bot_id || event.subtype === 'bot_message' || event.user === 'RELAY_BOT') {
      return res.status(200).json({ ok: true, ignored: 'bot_message' });
    }

    if (event.type === 'message' && event.text) {
      const author = event.user || 'SlackUser';
      await contextEngine.ingestSlackMessages([{ author, content: event.text }]);
    }
  }

  res.status(200).json({ ok: true });
});
