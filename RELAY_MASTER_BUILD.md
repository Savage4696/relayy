RELAY — MASTER BUILD SPECIFICATION
AI Tinkerers Global Hackathon 2026
Your work moves. Your context comes with it.

MASTER INSTRUCTION
Read this entire document before making changes. Treat it as the authoritative product and engineering specification for RELAY.
You are the founding engineer. Work autonomously: inspect the repo, create/modify files, install dependencies, configure services, implement the application, run builds/tests, debug failures, and polish the demo. Do not merely describe what you would build. Do not stop at planning. Do not ask for confirmation.
If an external service or credential is unavailable, implement the real integration boundary plus a deterministic local fallback. Prefer simple, reliable architecture over overengineering.

PRODUCT
Name: RELAY
Tagline: "Your work moves. Your context comes with it."
RELAY is a persistent work-context layer that follows a user's work across Slack and the browser.
Most AI agents have conversation memory. RELAY has work memory.
The core idea: Slack contains conversations, commitments, decisions, people, deadlines and work context. The browser contains external information, documentation, research, evidence and current-page context. RELAY connects those environments through persistent structured work state.

HACKATHON THEME
RELAY must clearly demonstrate that agents are leaving the chatbox.
Primary environments:
- Slack
- Browser
The environment must materially improve the agent. This must not feel like a chatbot merely embedded in another UI.

CORE GOLDEN PATH
Slack -> environmental event -> context extraction -> structured work state -> persistent storage -> browser -> current page context -> relevance detection -> evidence -> agent reasoning -> finding -> recommended action -> Slack

DEMO SCENARIO
Slack conversation:
Alex: "Acme's API authentication is failing."
Krishna: "I'll investigate the OAuth issue."
Sarah: "We need this fixed before Friday."
Alex: "Their docs mention they've changed their OAuth flow."

RELAY should derive approximately:
Task: Investigate Acme OAuth authentication issue
Owner: Krishna
Deadline: Friday
Entity: Acme
Topic: OAuth
Status: Investigating

The user opens: http://localhost:3000/demo/acme-docs/oauth-migration
The page is a realistic technical documentation page titled: "Acme OAuth Migration Guide"
The Chrome extension recognizes that the page relates to active work and shows:
RELAY ACTIVE WORK: Acme OAuth Authentication
Context match: 94%
Acme OAuth Migration Guide
This page may contain information relevant to your active investigation.
[ Add to investigation ]

After clicking the button, persist the page as evidence.
The agent analyzes active task, relevant Slack context, entity/topic, evidence.
It produces:
Acme OAuth investigation updated.
Finding: The new OAuth flow changes token handling and may explain the current authentication failure.
Impact: The existing authentication implementation may be incompatible with the updated flow.
Recommended next step: Review the token refresh implementation against the new OAuth flow.
Confidence: 91%
Then generate/send a concise contextual Slack update.

WHY NOT CHATGPT?
"A standalone chatbot has conversation memory. RELAY has work memory."

TECH STACK
- TypeScript
- Node.js
- Express or Fastify
- React + Vite
- Chrome Manifest V3
- Supabase / Postgres (or local SQLite fallback)
- OpenAI API
- Slack API
- Exa API
Optional: Tailwind CSS
