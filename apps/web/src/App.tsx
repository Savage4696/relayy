import React, { useState, useEffect } from 'react';
import { api, TaskContextSummary } from './api/client';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { AcmeDocsDemo } from './pages/AcmeDocsDemo';
import { SlackSimModal } from './components/SlackSimModal';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [activeContext, setActiveContext] = useState<TaskContextSummary | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSendingSlack, setIsSendingSlack] = useState<boolean>(false);
  const [slackMessageSent, setSlackMessageSent] = useState<boolean>(false);
  const [isSlackSimOpen, setIsSlackSimOpen] = useState<boolean>(false);

  const loadActiveContext = async () => {
    try {
      const data = await api.getActiveContext();
      if (data.tasks && data.tasks.length > 0) {
        setActiveContext(data.tasks[0]);
      }
    } catch (err) {
      console.error('Failed to load active context:', err);
    }
  };

  useEffect(() => {
    loadActiveContext();
    const interval = setInterval(loadActiveContext, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      const result = await api.resetDemo();
      setActiveContext(result.active_task);
      setSlackMessageSent(false);
    } catch (err) {
      console.error('Reset demo failed:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!activeContext?.task?.id) return;
    setIsAnalyzing(true);
    try {
      await api.runAnalysis(activeContext.task.id);
      await loadActiveContext();
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendSlackUpdate = async () => {
    if (!activeContext?.task?.id) return;
    setIsSendingSlack(true);
    try {
      await api.sendSlackUpdate(activeContext.task.id);
      setSlackMessageSent(true);
      await loadActiveContext();
    } catch (err) {
      console.error('Slack update failed:', err);
    } finally {
      setIsSendingSlack(false);
    }
  };

  const handleSimulateSlackMessage = async (author: string, content: string) => {
    try {
      await api.simulateSlackMessage([{ author, content }]);
      await loadActiveContext();
    } catch (err) {
      console.error('Slack message simulation failed:', err);
    }
  };

  const handleAddDemoEvidence = async (title: string, url: string, snippet: string) => {
    if (!activeContext?.task?.id) return;
    try {
      await fetch(`/api/context/task/${activeContext.task.id}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url || 'http://localhost:3000/demo/acme-docs/oauth-migration',
          title: title || 'Acme OAuth Migration Guide',
          content: snippet,
          snippet,
          relevance_score: 0.94,
        }),
      });
      await loadActiveContext();
    } catch (err) {
      console.error('Failed to add evidence:', err);
    }
  };

  const toggleNavigation = () => {
    const nextPath = currentPath === '/' ? '/demo/acme-docs/oauth-migration' : '/';
    window.history.pushState({}, '', nextPath);
    setCurrentPath(nextPath);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      {currentPath === '/demo/acme-docs/oauth-migration' ? (
        <AcmeDocsDemo
          onBack={() => {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }}
          onAddEvidence={handleAddDemoEvidence}
        />
      ) : (
        <>
          <Header
            onResetDemo={handleResetDemo}
            isResetting={isResetting}
            onNavigateDemo={toggleNavigation}
            currentPath={currentPath}
          />

          <main className="max-w-7xl mx-auto px-6 pb-16 flex-1 w-full">
            <Dashboard
              activeContext={activeContext}
              isAnalyzing={isAnalyzing}
              isSendingSlack={isSendingSlack}
              slackMessageSent={slackMessageSent}
              onRunAnalysis={handleRunAnalysis}
              onSendSlackUpdate={handleSendSlackUpdate}
              onOpenSlackSimModal={() => setIsSlackSimOpen(true)}
              onSimulateAddEvidence={() =>
                handleAddDemoEvidence(
                  'Acme OAuth Migration Guide',
                  'http://localhost:3000/demo/acme-docs/oauth-migration',
                  'The new OAuth 2.0 Authorization Code with PKCE flow replaces legacy client secrets. Access tokens expire after 60 minutes and require mandatory refresh token rotation.'
                )
              }
            />
          </main>
        </>
      )}

      <SlackSimModal
        isOpen={isSlackSimOpen}
        onClose={() => setIsSlackSimOpen(false)}
        onSimulate={handleSimulateSlackMessage}
      />
    </div>
  );
};
