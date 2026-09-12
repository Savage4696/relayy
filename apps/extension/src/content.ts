export {};

const API_BASE = 'http://localhost:3000';

async function evaluateCurrentPage() {
  const url = window.location.href;
  const title = document.title || 'Untitled Page';
  const visibleText = document.body ? document.body.innerText.slice(0, 1500) : '';
  const selectedText = window.getSelection() ? window.getSelection()!.toString() : '';

  try {
    const response = await fetch(`${API_BASE}/api/context/relevance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        title,
        visible_text: visibleText,
        selected_text: selectedText,
      }),
    });

    if (!response.ok) return;

    const data = await response.json();
    if (data.is_relevant) {
      injectRelayFloatingBadge(data, url, title, visibleText);
    }
  } catch (err) {
    console.log('[RELAY Content Script] Server connection standby.');
  }
}

function injectRelayFloatingBadge(relevanceData: any, url: string, title: string, contentSnippet: string) {
  if (document.getElementById('relay-extension-widget')) return;

  const widget = document.createElement('div');
  widget.id = 'relay-extension-widget';
  widget.style.position = 'fixed';
  widget.style.bottom = '24px';
  widget.style.right = '24px';
  widget.style.zIndex = '999999';
  widget.style.width = '340px';
  widget.style.backgroundColor = 'rgba(11, 15, 23, 0.95)';
  widget.style.backdropFilter = 'blur(16px)';
  widget.style.border = '1px solid rgba(56, 189, 248, 0.4)';
  widget.style.borderRadius = '16px';
  widget.style.padding = '18px';
  widget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.2)';
  widget.style.fontFamily = 'Inter, system-ui, sans-serif';
  widget.style.color = '#f8fafc';

  const matchPct = Math.round(relevanceData.score * 100);

  widget.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 6px;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #06b6d4;"></div>
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #38bdf8;">RELAY</span>
      </div>
      <button id="relay-close-btn" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 14px;">✕</button>
    </div>

    <div style="font-size: 10px; font-weight: 700; uppercase; color: #94a3b8; margin-bottom: 4px;">ACTIVE WORK</div>
    <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 8px; line-height: 1.3;">${relevanceData.task_title || 'Acme OAuth Authentication'}</div>

    <div style="display: inline-block; padding: 3px 8px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 11px; font-weight: 700; margin-bottom: 10px;">
      Context match: ${matchPct}%
    </div>

    <div style="font-size: 12px; font-weight: 600; color: #e2e8f0; margin-bottom: 4px;">${title}</div>
    <div style="font-size: 11px; color: #94a3b8; margin-bottom: 12px; line-height: 1.4;">
      This page may contain information relevant to your active investigation.
    </div>

    <button id="relay-add-evidence-btn" style="width: 100%; padding: 9px; border-radius: 8px; background: linear-gradient(135deg, #0891b2, #2563eb); border: none; color: #ffffff; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);">
      [ Add to investigation ]
    </button>
  `;

  document.body.appendChild(widget);

  document.getElementById('relay-close-btn')?.addEventListener('click', () => {
    widget.remove();
  });

  const addBtn = document.getElementById('relay-add-evidence-btn');
  addBtn?.addEventListener('click', async () => {
    addBtn.innerText = 'Adding to investigation...';
    (addBtn as HTMLButtonElement).disabled = true;

    try {
      const res = await fetch(`${API_BASE}/api/context/task/${relevanceData.task_id}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          title,
          content: contentSnippet,
          snippet: contentSnippet.slice(0, 180) + '...',
          relevance_score: relevanceData.score,
        }),
      });

      if (res.ok) {
        addBtn.innerText = 'Added to investigation ✓';
        addBtn.style.background = 'rgba(16, 185, 129, 0.8)';
      }
    } catch (err) {
      addBtn.innerText = 'Failed to add evidence';
    }
  });
}

// Run evaluation on page load
if (document.readyState === 'complete') {
  evaluateCurrentPage();
} else {
  window.addEventListener('load', evaluateCurrentPage);
}
