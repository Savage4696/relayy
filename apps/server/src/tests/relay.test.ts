import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../db/database.js';
import { contextEngine } from '../services/contextEngine.js';
import { relevanceEngine } from '../services/relevanceEngine.js';
import { extractionService } from '../services/extractionService.js';
import { slackService } from '../services/slackService.js';

test('1. Database Seed & Demo Reset', () => {
  db.seedDemoState();
  const tasks = db.getActiveTasks();
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].owner, 'Krishna');
  assert.equal(tasks[0].entity, 'Acme');
  assert.equal(tasks[0].topic, 'OAuth');
});

test('2. Task Extraction Pipeline', async () => {
  const sampleSlackText = `
Alex: "Acme's API authentication is failing."
Krishna: "I'll investigate the OAuth issue."
Sarah: "We need this fixed before Friday."
`;
  const extracted = await extractionService.extractFromMessages(sampleSlackText);
  assert.equal(extracted.owner, 'Krishna');
  assert.equal(extracted.deadline, 'Friday');
  assert.equal(extracted.entity, 'Acme');
  assert.equal(extracted.topic, 'OAuth');
  assert.ok(extracted.confidence >= 0.85);
});

test('3. Relevance Engine Scoring Heuristics', async () => {
  db.seedDemoState();
  const result = await relevanceEngine.evaluateRelevance({
    url: 'http://localhost:3000/demo/acme-docs/oauth-migration',
    title: 'Acme OAuth Migration Guide',
    visible_text: 'This guide explains the changes in Acme API authentication and OAuth 2.0 flow token refresh migration.',
  });

  assert.equal(result.is_relevant, true);
  assert.ok(result.score >= 0.85);
  assert.ok(result.reason.length > 0);
});

test('4. Evidence Deduplication & Persistence', () => {
  db.seedDemoState();
  const activeTask = db.getActiveTasks()[0];

  const ev1 = db.addEvidence({
    task_id: activeTask.id,
    url: 'http://localhost:3000/demo/acme-docs/oauth-migration',
    title: 'Acme OAuth Migration Guide',
    content: 'OAuth flow content',
    relevance_score: 0.94,
  });

  const ev2 = db.addEvidence({
    task_id: activeTask.id,
    url: 'http://localhost:3000/demo/acme-docs/oauth-migration',
    title: 'Acme OAuth Migration Guide',
    content: 'OAuth flow content',
    relevance_score: 0.94,
  });

  assert.equal(ev1.id, ev2.id); // Same evidence object returned for duplicate URL
  const allEvidence = db.getEvidence(activeTask.id);
  assert.equal(allEvidence.length, 1);
});

test('5. Context Retrieval & Summary', () => {
  db.seedDemoState();
  const activeTask = db.getActiveTasks()[0];
  const context = contextEngine.getTaskContext(activeTask.id);

  assert.ok(context !== null);
  assert.equal(context.events.length, 4);
});

test('6. Slack Update Generation', async () => {
  db.seedDemoState();
  const activeTask = db.getActiveTasks()[0];

  const result = await slackService.postContextUpdate({
    taskId: activeTask.id,
    finding: 'The new OAuth flow changes token handling.',
    recommendedAction: 'Review the token refresh implementation.',
    confidence: 0.91,
  });

  assert.equal(result.success, true);
  assert.ok(result.formattedMessage.includes('RELAY —'));
  assert.ok(result.formattedMessage.includes('Confidence: 91%'));
});
