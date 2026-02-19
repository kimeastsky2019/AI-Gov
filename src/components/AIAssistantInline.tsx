/**
 * AI Assistant Inline - 페이지 내에 인라인으로 표시되는 AI 어시스턴트
 * 탭 콘텐츠 안에 직접 임베드되어 사용자가 쉽게 확인하고 사용 가능
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Brain, Send, Loader2, Sparkles, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiAPI } from '@/api/client';
import { toast } from 'sonner';
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

interface AIAssistantInlineProps {
  context: string;
  contextData?: string;
  systemPrompt?: string;
  quickActions?: QuickAction[];
  title?: string;
  description?: string;
}

export const AIAssistantInline: React.FC<AIAssistantInlineProps> = ({
  context,
  contextData,
  systemPrompt,
  quickActions,
  title,
  description,
}) => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
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
  const panelDesc = description || t('ai.desc');

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

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    toast.success(t('ai.copied'));
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {panelTitle}
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-[10px]">
                AI Powered
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground">{panelDesc}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            {t('ai.reset')}
          </Button>
        )}
      </div>

      {/* Quick Actions Grid */}
      {messages.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => sendMessage(action.prompt)}
              className="text-left p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{action.icon}</span>
                <div>
                  <div className="font-medium text-sm text-purple-800 dark:text-purple-200 group-hover:text-purple-900 dark:group-hover:text-purple-100">
                    {action.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {action.prompt.substring(0, 80)}...
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Conversation Area */}
      {messages.length > 0 && (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-card border border-border'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium">
                      <Brain className="w-3.5 h-3.5" /> {t('ai.analysisResult')}
                    </div>
                    <button
                      onClick={() => handleCopy(msg.content, i)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</div>
                <div className="text-[10px] mt-2 opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                <span className="text-sm text-muted-foreground">{t('ai.loading')}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Quick action chips when messages exist */}
      {messages.length > 0 && !loading && (
        <div className="flex gap-2 flex-wrap">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => sendMessage(action.prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 transition-colors"
            >
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={t('ai.placeholder')}
          className="text-sm min-h-[48px] max-h-[120px] resize-none border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
          rows={1}
        />
        <Button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white shrink-0 h-12 w-12"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIAssistantInline;
