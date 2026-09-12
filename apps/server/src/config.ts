import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  DEMO_MODE: process.env.DEMO_MODE !== 'false',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  EXA_API_KEY: process.env.EXA_API_KEY || '',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN || '',
  SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN || '',
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET || '',
};
