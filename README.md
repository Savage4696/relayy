# RELAY — Persistent Work-Context Layer for Slack & the Browser
> **AI Tinkerers Global Hackathon 2026**  
> *"Your work moves. Your context comes with it."*

---

## ⚡ QUICK DEMO STEPS (START HERE)

Follow these steps to run the complete Golden Path scenario locally:

### 1. Install & Start Applications
```bash
# In the root repository directory (relayy)
npm run setup
npm run build
npm run dev
```
- **RELAY Backend Server**: running at `http://localhost:3000`
- **RELAY Web Dashboard & Demo Website**: running at `http://localhost:5173` (or `http://localhost:3000`)

### 2. Golden Path Scenario Walkthrough
1. **Open Dashboard**: Go to `http://localhost:5173/` (or click "Reset Demo State").
2. **Observe Ingested Slack Context**:
   - Alex: *"Acme's API authentication is failing."*
   - Krishna: *"I'll investigate the OAuth issue."*
   - Sarah: *"We need this fixed before Friday."*
   - Alex: *"Their docs mention they've changed their OAuth flow."*
3. **Verify Derived Work State**:
   - **Task**: Investigate Acme OAuth authentication issue
   - **Owner**: Krishna | **Deadline**: Friday | **Entity**: Acme | **Topic**: OAuth | **Status**: Investigating
4. **Open Technical Docs Page**:
   - Click **"Open Demo Acme Docs Page"** in the top bar or navigate to `http://localhost:5173/demo/acme-docs/oauth-migration`.
5. **Context Relevance Match & Evidence Capture**:
   - Notice the high context match (**94% match**).
   - Click **`[ Add to investigation ]`**. The page is immediately captured as evidence.
6. **Agent Reasoning & Findings**:
   - Return to Dashboard and click **`1. Run Agent Reasoning`**.
   - View synthesized output:
     - **Finding**: *"The new OAuth flow changes token handling and may explain the current authentication failure."*
     - **Impact**: *"The existing authentication implementation may be incompatible with the updated flow."*
     - **Recommended Next Step**: *"Review the token refresh implementation against the new OAuth flow."*
     - **Confidence**: **91%**
7. **Autonomous Slack Update**:
   - Click **`2. Send Contextual Slack Update`**.
   - Notice the structured update generated and posted to Slack (or logged in demo mode):
     ```
     RELAY — Investigate Acme OAuth authentication issue updated.

     Finding:
     The new OAuth flow changes token handling and may explain the current authentication failure.

     Next step:
     Review the token refresh implementation against the new OAuth flow.

     Confidence: 91%
     ```
8. **Reset Demo**: Click **`Reset Demo State`** (`POST /api/demo/reset`) to replay anytime.

---

## 💡 WHAT IS RELAY & WHY IT MATTERS

Most AI agents have **conversation memory**. RELAY has **work memory**.

Standalone chatbots wait for the user to copy-paste context back and forth between tools. RELAY observes environmental work context in Slack, structures it into persistent work state, tracks the user's browser context, scores document relevance, synthesizes findings over evidence, and posts concise updates back to Slack.

### Hackathon Theme: Agents Leaving the Chatbox
RELAY demonstrates an agent operating across two primary working environments:
- **Slack**: Conversations, commitments, deadlines, people, decisions.
- **Browser**: External documentation, migration guides, technical research, evidence.

---

## 🏗️ ARCHITECTURE

```
                                 ┌───────────────────────────────┐
                                 │   Slack API / Local Webhook   │
                                 └───────────────┬───────────────┘
                                                 │
                                                 ▼
┌──────────────────────────────┐    ┌───────────────────────────┐    ┌──────────────────────────────┐
│ Chrome Extension Manifest V3 │───►│     RELAY API Server      │◄───│     Web UI Dashboard & Docs │
│ - Page Context Inspector     │    │  (Node.js + Express + TS) │    │   (React 18 + Vite + Tailwind│
│ - Floating Badge & Popup     │    │  - Context Engine         │    └──────────────────────────────┘
└──────────────────────────────┘    │  - Relevance Engine       │
                                    │  - OpenAI Reasoning Agent │
                                    │  - Exa Search Service     │
                                    └────────────┬──────────────┘
                                                 │
                                                 ▼
                                    ┌───────────────────────────┐
                                    │ Postgres / Supabase Schema│
                                    │   (or SQLite Local DB)    │
                                    └───────────────────────────┘
```

---

## 🛠️ TECH STACK

- **Language**: TypeScript (End-to-End)
- **Backend**: Node.js, Express.js
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Browser Extension**: Chrome Manifest V3
- **Database**: Supabase / PostgreSQL schema + Embedded SQLite local store
- **AI Reasoning**: OpenAI API (`gpt-4o-mini` with structured JSON output + fallback)
- **External Search**: Exa API (`https://api.exa.ai/search`)
- **Messaging**: Slack Events API & `chat.postMessage`

---

## 🔑 ENVIRONMENT VARIABLES & SETUP

Copy `.env.example` to `.env` in the root or `apps/server/.env`:

```bash
# OpenAI API Key (for LLM context extraction & agent reasoning)
OPENAI_API_KEY=

# Exa API Key (for external evidence search/retrieval)
EXA_API_KEY=

# Supabase / Postgres Configuration (Optional if running local fallback DB)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Slack API Credentials (Optional - fallback to local demo logging if omitted)
SLACK_BOT_TOKEN=
SLACK_APP_TOKEN=
SLACK_SIGNING_SECRET=

# Local Mode & Port
PORT=3000
DEMO_MODE=true
```

> **Note**: RELAY features deterministic local fallbacks for all external services (OpenAI, Exa, Supabase, Slack). The application runs 100% reliably out of the box even without external credentials configured!

---

## 🧩 DATABASE SCHEMA (SUPABASE / POSTGRES)

The migration DDL is located in `supabase/migrations/20260912000000_init_schema.sql`:
- **`tasks`**: `id`, `title`, `description`, `owner`, `status`, `deadline`, `workspace_id`, `entity`, `topic`, `confidence`, `created_at`, `updated_at`
- **`context_events`**: `id`, `task_id`, `source`, `source_id`, `event_type`, `content`, `author`, `timestamp`
- **`evidence`**: `id`, `task_id`, `url`, `title`, `content`, `relevance_score`, `snippet`, `created_at`
- **`entities`**: `id`, `name`, `type`
- **`agent_actions`**: `id`, `task_id`, `action`, `finding`, `impact`, `recommended_action`, `confidence`, `approved`, `created_at`

---

## 🔌 LOADING THE CHROME EXTENSION

1. Build the extension:
   ```bash
   cd apps/extension && npm run build
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `apps/extension` folder.
5. Open `http://localhost:5173/demo/acme-docs/oauth-migration` to test the floating badge and popup!

---

## 🛡️ FAILURE HANDLING & RELIABILITY

- **API Key Absence**: Graceful fallback to deterministic task extraction and heuristic relevance scoring.
- **Network / External API Failure**: Never loses persisted evidence; never crashes on service timeout.
- **Duplicate Events**: Idempotent message ingestion and evidence deduplication by URL.
- **Self-Message Loop**: Explicitly filters out bot messages and RELAY self-generated updates.

---

## 📄 LICENSE

Built for the **AI Tinkerers Global Hackathon 2026**.
