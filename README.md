# RELAY — Persistent Work Context for AI

> **Your work moves. Your context comes with it.**

RELAY is a persistent work-context layer that follows a user's active work across **Slack and the browser**.

Instead of forcing people to copy and paste context into a chatbot, RELAY captures commitments, browser context, evidence, and relevant documentation — then gives an AI agent enough structured context to reason and act.

**Conversation memory remembers what you said. RELAY remembers what you were doing.**

---

## ⚡ The Golden Path

```
Slack conversation
      ↓
Task + owner + deadline extraction
      ↓
Persistent work state
      ↓
Browser context detection
      ↓
Evidence + relevance matching
      ↓
AI reasoning
      ↓
Actionable finding
      ↓
Contextual Slack update
```

### Example

A Slack conversation establishes:

> **Investigate Acme OAuth authentication issue before Friday.**

RELAY derives the task, follows the user's browser context to the relevant OAuth migration documentation, captures it as evidence, reasons over the investigation, and produces a structured Slack update.

The included demo reports a **94% context match** and a **91% reasoning confidence** for the Golden Path scenario.

---

## Why it matters

Most AI assistants have **conversation memory**.

Work does not happen inside one conversation.

It happens across:

- Slack
- Browser tabs
- Documentation
- Tickets
- Research
- Decisions
- Deadlines
- People

RELAY connects those environments into persistent work state.

---

## 🏗️ Architecture

```
┌──────────────────────────┐
│ Slack / Work Conversations│
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Context + Task Extraction │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Persistent Work State     │
└────────────┬─────────────┘
             ↑
┌────────────┴─────────────┐
│ Chrome Extension          │
│ Browser Context + Evidence│
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Relevance + AI Reasoning  │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Actionable Finding        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Slack Update              │
└──────────────────────────┘
```

---

## 🛠️ Stack

**Frontend**  
React 18 · Vite · Tailwind CSS

**Backend**  
TypeScript · Node.js · Express

**AI / Search**  
OpenAI API · Exa

**Work Context**  
Slack API · Chrome Manifest V3

**Data**  
PostgreSQL · Supabase · SQLite

---

## 🎬 Run the demo

```bash
npm run setup
npm run build
npm run dev
```

Then follow the Golden Path:

1. Open the dashboard.
2. Inspect the ingested Slack context.
3. Review the derived task, owner, deadline, entity, and topic.
4. Open the demo technical documentation page.
5. Capture the relevant evidence.
6. Run agent reasoning.
7. Send the contextual Slack update.
8. Reset the demo and replay.

RELAY includes deterministic local fallbacks, so the core demo can run without external service credentials.

---

## 🔌 Browser Extension

```bash
cd apps/extension
npm run build
```

Load the resulting extension through Chrome's developer-mode **Load unpacked** flow.

---

## 🛡️ Reliability

RELAY is designed to degrade gracefully:

- Missing API credentials → deterministic local fallbacks
- Network failures → persisted evidence remains available
- Duplicate events → idempotent ingestion
- Duplicate evidence → URL-based deduplication
- Self-generated Slack messages → filtered to avoid loops

---

## 🎯 Built for

RELAY was built for the **AI Tinkerers Global Hackathon 2026** around the theme of agents operating outside the chatbox.

The broader idea is simple:

> **AI should understand the work around the user — not just the words inside a prompt.**

---

### TypeScript · React · Node · Chrome Extension · Slack · PostgreSQL · AI Agents
