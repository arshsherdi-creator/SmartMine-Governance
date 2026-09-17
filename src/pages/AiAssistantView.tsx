import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  User,
  Shield,
  Bot,
  HelpCircle,
  Database,
  ArrowRight,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sourceData?: string[];
  isAiGenerated?: boolean;
}

export const AiAssistantView: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_initial',
      sender: 'assistant',
      text: `Greetings ${currentUser.name}. I am the **SmartMine AI Compliance & Risk Assistant**, linked to Coal India Limited and DGMS regulatory registers.\n\nYou can ask me complex queries regarding statutory adherence, Section 22 prohibitive orders, overdue requirements, CAPA workflows, and environmental thresholds.`,
      timestamp: 'Just now',
      sourceData: [
        'Live Enterprise Database (6 Coal Mining Leases)',
        'DGMS CMR 2017 Regulatory Register',
        'CPCB Ambient Sensor Logs'
      ],
      isAiGenerated: true
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          role: currentUser.roleTitle
        })
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          text: data.data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourceData: data.data.sourceData,
          isAiGenerated: data.data.isAiGenerated
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showToast('error', 'Assistant Offline', 'Unable to retrieve AI analysis. Please retry.');
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'An error occurred while communicating with the AI intelligence service. Please verify server connectivity or try a different statutory query.',
          timestamp: 'Now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const PROMPT_SUGGESTIONS = [
    'Which mines require immediate attention and why?',
    'Show all overdue compliance requirements across subsidiaries',
    'What is the status of active DGMS Section 22 notices?',
    'Why is Eastern Valley Open Cast classified as Critical Risk?',
    'Summarize recurring slope stability and ventilation violations'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] min-h-[560px] bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
      {/* Top Bar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              SmartMine AI Governance Assistant
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Querying as <span className="font-semibold">{currentUser.roleTitle}</span> ({currentUser.department})
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>Statutory Telemetry Grounded</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-800 dark:bg-slate-700 text-amber-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-lg p-4 leading-relaxed ${
                  isUser
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line text-xs font-normal">
                  {msg.text}
                </div>

                {/* Source data chips for transparency */}
                {msg.sourceData && msg.sourceData.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Grounding:</span>
                    {msg.sourceData.map((src, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-1 text-[10px] text-right opacity-60">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-3 text-xs text-slate-500 flex items-center gap-2 border border-slate-200 dark:border-slate-800">
              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing cross-subsidiary compliance registers with Gemini 3.8 Flash...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700/60 overflow-x-auto whitespace-nowrap flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Suggested Inquiries:
        </span>
        {PROMPT_SUGGESTIONS.map((suggestion, sIdx) => (
          <button
            key={sIdx}
            onClick={() => handleSend(suggestion)}
            className="px-2.5 py-1 text-xs rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition-colors shrink-0"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask about high-risk mines, Section 22 orders, DGMS regulations, or CAPAs..."
            disabled={loading}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
