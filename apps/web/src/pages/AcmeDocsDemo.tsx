import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ShieldAlert, KeyRound, CheckCircle2, Copy, FileText, Check } from 'lucide-react';

interface AcmeDocsDemoProps {
  onBack: () => void;
  onAddEvidence: (title: string, url: string, snippet: string) => void;
}

export const AcmeDocsDemo: React.FC<AcmeDocsDemoProps> = ({ onBack, onAddEvidence }) => {
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddEvidence = () => {
    onAddEvidence(
      'Acme OAuth Migration Guide',
      window.location.href,
      'The new OAuth 2.0 Authorization Code with PKCE flow replaces client secret header authentication. Tokens expire after 60 minutes and require mandatory refresh token rotation.'
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans">
      {/* Acme Developer Header */}
      <header className="border-b border-slate-800 bg-[#161b22] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to RELAY
            </button>
            <div className="h-5 w-[1px] bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white text-xs">
                A
              </div>
              <span className="font-bold text-slate-100 text-sm tracking-tight">Acme Developer Docs</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              API v2.4 (Current)
            </span>
            <button
              onClick={handleAddEvidence}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20'
              }`}
            >
              {added ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              {added ? 'Added to RELAY Evidence!' : 'Add to investigation'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Documentation Body */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Security & Migration Guides
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Acme OAuth Migration Guide
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Migration path for updating client applications from legacy header token authentication to the OAuth 2.0 Authorization Code Flow with PKCE & Token Refresh Rotation.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-8 p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-300">Deprecation Notice:</strong> Legacy static client secrets and basic auth headers for Acme API v1 end-of-life cutoff date is approaching. All client authentication calls must migrate to OAuth 2.0 endpoints immediately.
          </div>
        </div>

        {/* Section 1: Changed Authentication Flow */}
        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            1. Changed Authentication Flow
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Acme has upgraded its authentication infrastructure to enforce strict OAuth 2.0 authorization code grant specs with Proof Key for Code Exchange (PKCE). Static access tokens are no longer supported.
          </p>

          <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
            <div className="text-cyan-400 font-semibold">// New OAuth Authorization Endpoint</div>
            <div>GET https://api.acme.com/oauth/v2/authorize</div>
            <div className="text-slate-500 pl-4">?response_type=code</div>
            <div className="text-slate-500 pl-4">&client_id=YOUR_CLIENT_ID</div>
            <div className="text-slate-500 pl-4">&code_challenge=CODE_CHALLENGE</div>
            <div className="text-slate-500 pl-4">&code_challenge_method=S256</div>
          </div>
        </section>

        {/* Section 2: Token Handling & Refresh Rotation */}
        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
            2. Token Handling & Refresh Token Rotation
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Access tokens issued under OAuth 2.0 now expire after <strong className="text-white">60 minutes (3600s)</strong>. Applications must handle token refresh calls automatically.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-cyan-300 mb-2">Short-Lived Access Tokens</h3>
              <p className="text-slate-400 leading-relaxed">
                Access tokens are now strictly scoped and short-lived. Passing an expired token results in HTTP 401 Unauthorized errors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-cyan-300 mb-2">Refresh Token Rotation</h3>
              <p className="text-slate-400 leading-relaxed">
                Every time a refresh token is used, a new refresh token is issued and the previous refresh token is invalidated immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Implementation Requirements & Code Example */}
        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
            3. Required Implementation Changes
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Ensure your HTTP client includes automatic retry handling on HTTP 401 responses by invoking the token refresh method:
          </p>

          <div className="bg-[#161b22] rounded-xl border border-slate-800 overflow-hidden text-xs">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400 font-mono">
              <span>auth-client.ts</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 hover:text-white transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-200 font-mono leading-relaxed">
              {`async function fetchAcmeApi(endpoint, options = {}) {
  let token = await getValidAccessToken();

  let response = await fetch(\`https://api.acme.com/v2\${endpoint}\`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': \`Bearer \${token}\`
    }
  });

  // Handle Token Expiry & Refresh Rotation
  if (response.status === 401) {
    const newToken = await refreshOAuthToken();
    response = await fetch(\`https://api.acme.com/v2\${endpoint}\`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': \`Bearer \${newToken}\`
      }
    });
  }

  return response.json();
}`}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
};
