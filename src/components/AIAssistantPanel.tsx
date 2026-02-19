/**
 * AI Assistant Panel - 재사용 가능한 AI 인텔리전트 패널
 * 각 페이지에서 컨텍스트에 맞는 AI 분석/채팅을 제공
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Brain, Send, Loader2, X, Sparkles, MessageSquare, ChevronDown, ChevronUp, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { aiAPI } from '@/api/client';
import { useI18n } from '@/lib/i18n';

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface QuickAction {
  label: string;
  prompt: string;
  icon?: string;
}

interface AIAssistantPanelProps {
  context: string;  // 페이지 컨텍스트 (compliance, ai-services, reports)
  contextData?: string;  // 분석할 데이터 (JSON 문자열 등)
  systemPrompt?: string;  // 커스텀 시스템 프롬프트
  quickActions?: QuickAction[];
  title?: string;
  defaultExpanded?: boolean;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  context,
  contextData,
  systemPrompt,
  quickActions,
  title,
  defaultExpanded = false,
}) => {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const DEFAULT_QUICK_ACTIONS: Record<string, QuickAction[]> = useMemo(() => ({
    compliance: [
      { label: t('ai.compliance.analysis'), prompt: t('ai.compliance.analysis.prompt'), icon: '📋' },
      { label: t('ai.compliance.improvement'), prompt: t('ai.compliance.improvement.prompt'), icon: '💡' },
      { label: t('ai.compliance.automation'), prompt: t('ai.compliance.automation.prompt'), icon: '🤖' },
      { label: t('ai.compliance.trends'), prompt: t('ai.compliance.trends.prompt'), icon: '📰' },
    ],
    'ai-services': [
      { label: t('ai.services.risk'), prompt: t('ai.services.risk.prompt'), icon: '⚠️' },
      { label: t('ai.services.performance'), prompt: t('ai.services.performance.prompt'), icon: '📊' },
      { label: t('ai.services.security'), prompt: t('ai.services.security.prompt'), icon: '🔒' },
      { label: t('ai.services.governance'), prompt: t('ai.services.governance.prompt'), icon: '📝' },
    ],
    reports: [
      { label: t('ai.reports.analysis'), prompt: t('ai.reports.analysis.prompt'), icon: '📋' },
      { label: t('ai.reports.deadline'), prompt: t('ai.reports.deadline.prompt'), icon: '⏰' },
      { label: t('ai.reports.review'), prompt: t('ai.reports.review.prompt'), icon: '✅' },
      { label: t('ai.reports.generate'), prompt: t('ai.reports.generate.prompt'), icon: '📄' },
    ],
  }), [t]);

  const SYSTEM_PROMPTS: Record<string, string> = useMemo(() => ({
    compliance: t('ai.system.compliance'),
    'ai-services': t('ai.system.aiServices'),
    reports: t('ai.system.reports'),
  }), [t]);

  const actions = quickActions || DEFAULT_QUICK_ACTIONS[context] || [];
  const sysPrompt = systemPrompt || SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.compliance;
  const panelTitle = title || t('ai.title');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    const userMsg: AIMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const fullPrompt = contextData
        ? `${sysPrompt}\n\n[${t('ai.contextLabel')}]:\n${contextData}`
        : sysPrompt;

      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await aiAPI.chat(text, undefined, history, undefined, fullPrompt);
      const data = res.data;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || data.response || t('ai.noResponse'),
        timestamp: new Date().toISOString(),
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `${t('ai.error')}: ${err.response?.data?.error || err.message}`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setExpanded(true)}
          className="rounded-full w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Brain className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-gray-900 border rounded-xl shadow-xl w-72 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-purple-600 text-white">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">{panelTitle}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMinimized(false)} className="hover:bg-white/20 rounded p-1">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setExpanded(false)} className="hover:bg-white/20 rounded p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {messages.length > 0 && (
            <div className="px-4 py-2 text-xs text-muted-foreground truncate">
              {messages[messages.length - 1].content.substring(0, 60)}...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-h-[600px] flex flex-col bg-white dark:bg-gray-900 border rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-purple-600 text-white shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <span className="font-medium text-sm">{panelTitle}</span>
          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">AI</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setMinimized(true)} className="hover:bg-white/20 rounded p-1">
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setExpanded(false)} className="hover:bg-white/20 rounded p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[360px]">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
              {t('ai.askQuestion')}
            </p>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-1.5">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(action.prompt)}
                  className="text-left px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-xs border border-purple-100 dark:border-purple-800"
                >
                  <span className="mr-1.5">{action.icon}</span>
                  <span className="font-medium text-purple-700 dark:text-purple-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-foreground'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1 mb-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
                  <Brain className="w-3 h-3" /> AI
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-xs">{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-500" />
              <span className="text-xs text-muted-foreground">{t('ai.loadingShort')}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions when messages exist */}
      {messages.length > 0 && (
        <div className="px-3 py-1 border-t flex gap-1 overflow-x-auto shrink-0">
          {actions.slice(0, 3).map((action, i) => (
            <button
              key={i}
              onClick={() => sendMessage(action.prompt)}
              className="text-[10px] px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 whitespace-nowrap border border-purple-100 dark:border-purple-800"
            >
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t shrink-0">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={t('ai.placeholderShort')}
            className="text-sm min-h-[40px] max-h-[80px] resize-none"
            rows={1}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            size="icon"
            className="bg-purple-600 hover:bg-purple-700 text-white shrink-0 h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
