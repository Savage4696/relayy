import { CONFIG } from '../config.js';

export interface ExaSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export class ExaService {
  private apiKey: string;

  constructor() {
    this.apiKey = CONFIG.EXA_API_KEY;
  }

  public async search(query: string): Promise<ExaSearchResult[]> {
    if (!this.apiKey) {
      console.log('[ExaService] EXA_API_KEY not configured, skipping external retrieval.');
      return [];
    }

    try {
      const response = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          query,
          numResults: 3,
          contents: { text: true },
        }),
      });

      if (!response.ok) {
        console.warn(`[ExaService] Exa API error ${response.status}: ${response.statusText}`);
        return [];
      }

      const data = (await response.json()) as any;
      if (Array.isArray(data.results)) {
        return data.results.map((r: any) => ({
          title: r.title || 'External Reference',
          url: r.url || '',
          snippet: r.text ? r.text.slice(0, 300) : r.snippet || '',
        }));
      }
    } catch (err) {
      console.warn('[ExaService] Exa search failed gracefully:', err);
    }

    return [];
  }
}

export const exaService = new ExaService();
