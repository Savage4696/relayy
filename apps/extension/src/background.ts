export {};

const API_BASE = 'http://localhost:3000';

chrome.runtime.onInstalled.addListener(() => {
  console.log('[RELAY Extension] Service worker installed.');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkTabRelevance(tabId, tab);
  }
});

async function checkTabRelevance(tabId: number, tab: chrome.tabs.Tab) {
  if (!tab.url || tab.url.startsWith('chrome://')) return;

  try {
    const res = await fetch(`${API_BASE}/api/context/relevance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: tab.url,
        title: tab.title || '',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.is_relevant) {
        chrome.action.setBadgeText({ tabId, text: 'WORK' });
        chrome.action.setBadgeBackgroundColor({ tabId, color: '#06b6d4' });
      } else {
        chrome.action.setBadgeText({ tabId, text: '' });
      }
    }
  } catch (err) {
    console.warn('[RELAY Extension] Relevance check error:', err);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_ACTIVE_WORK') {
    fetch(`${API_BASE}/api/context/active`)
      .then((res) => res.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === 'CHECK_RELEVANCE') {
    fetch(`${API_BASE}/api/context/relevance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.payload),
    })
      .then((res) => res.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === 'ADD_EVIDENCE') {
    fetch(`${API_BASE}/api/context/task/${message.taskId}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.evidence),
    })
      .then((res) => res.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
});
