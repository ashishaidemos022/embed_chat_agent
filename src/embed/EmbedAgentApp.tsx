import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import { useEmbedChat } from './useEmbedChat';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

function resolvePublicId(): string | null {
  if (typeof window === 'undefined') return null;
  const parts = window.location.pathname.split('/').filter(Boolean);
  const embedIndex = parts.findIndex((part) => part === 'embed');
  if (embedIndex === -1 || !parts[embedIndex + 2]) {
    return null;
  }
  return decodeURIComponent(parts[embedIndex + 2]);
}

export function EmbedAgentApp() {
  const publicId = useMemo(() => resolvePublicId(), []);
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const theme = search.get('theme') === 'light' ? 'light' : 'dark';
  const isWidget = search.get('widget') === '1';
  const [composer, setComposer] = useState('');

  const {
    messages,
    agentMeta,
    isLoadingMeta,
    isSending,
    error,
    sendMessage,
    resetChat
  } = useEmbedChat(publicId || '', { persist: isWidget });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const showTypingIndicator = isSending && messages[messages.length - 1]?.role === 'user';

  if (!publicId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Missing public embed id.</p>
      </div>
    );
  }

  const allowSend = composer.trim().length > 0 && !isSending;
  const composerPlaceholder = agentMeta?.name ? `Message ${agentMeta.name}` : 'Send a message…';
  const statusText = isSending ? 'Responding…' : 'Ready';

  const handleSend = () => {
    if (!composer.trim()) return;
    sendMessage(composer);
    setComposer('');
  };

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col relative overflow-hidden',
        theme === 'light'
          ? 'bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900'
          : 'bg-[#040714] text-white',
        isWidget ? 'w-full h-full max-w-sm' : ''
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div
          className={cn(
            'absolute -right-12 top-2 h-48 w-48 rounded-full blur-3xl',
            theme === 'light' ? 'bg-indigo-300/50' : 'bg-indigo-600/40'
          )}
        />
        <div
          className={cn(
            'absolute -left-16 bottom-2 h-56 w-56 rounded-full blur-3xl',
            theme === 'light' ? 'bg-purple-200/50' : 'bg-purple-700/40'
          )}
        />
      </div>

      <div
        className={cn(
          'relative px-4 py-3 border-b flex items-center justify-between backdrop-blur',
          theme === 'light' ? 'border-slate-200/80 bg-white/80' : 'border-white/10 bg-slate-900/60'
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30',
              theme === 'light' ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
            )}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold tracking-tight">{agentMeta?.name || 'AI Agent'}</p>
            <p className={cn('text-[12px] leading-tight line-clamp-2', theme === 'light' ? 'text-slate-500' : 'text-white/70')}>
              {agentMeta?.summary || 'Conversational assistant'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-semibold">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isSending ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              )}
            />
            {statusText}
          </div>
          <Button
            size="xs"
            variant="ghost"
            onClick={resetChat}
            aria-label="Reset conversation"
            className={cn(
              'gap-1 rounded-full backdrop-blur',
              theme === 'light' ? 'text-slate-500 hover:bg-slate-100' : 'text-white/70 hover:bg-white/10'
            )}
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 soft-scrollbar"
        role="log"
        aria-live="polite"
      >
        {isLoadingMeta && (
          <div className="flex items-center gap-2 text-sm opacity-80">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading agent…
          </div>
        )}
        {messages.length === 0 && !isLoadingMeta && (
          <div className={cn('text-sm text-center rounded-2xl border px-3 py-3', theme === 'light' ? 'text-slate-500 border-slate-200 bg-white/70' : 'text-white/70 border-white/10 bg-white/5')}>
            Start the conversation and this agent will respond in real time.
          </div>
        )}
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={cn(
                'message-enter px-4 py-3 rounded-3xl text-sm leading-relaxed max-w-[85%] shadow-sm transition-all',
                isUser
                  ? 'ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                  : theme === 'light'
                  ? 'bg-white text-slate-900 border border-slate-100'
                  : 'bg-white/5 text-white border border-white/10'
              )}
            >
              <div className="text-[10px] uppercase tracking-[0.35em] mb-1 opacity-70 flex items-center gap-1">
                {isUser ? 'You' : 'Agent'}
              </div>
              <p className="whitespace-pre-wrap text-left">{message.content}</p>
            </div>
          );
        })}
        {showTypingIndicator && (
          <div
            role="status"
            className={cn(
              'message-enter px-4 py-3 rounded-3xl inline-flex items-center gap-3 text-xs max-w-[70%] border',
              theme === 'light'
                ? 'bg-white text-slate-600 border-slate-200 shadow-sm'
                : 'bg-white/5 text-white/80 border-white/10'
            )}
          >
            <div className="text-[10px] uppercase tracking-[0.35em] opacity-70">Agent</div>
            <div className="flex items-center gap-1 text-current">
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.3em] opacity-60">Thinking…</span>
          </div>
        )}
        {error && (
          <div className="text-xs text-rose-300 font-medium">{error}</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        className={cn(
          'relative px-4 py-4 border-t backdrop-blur',
          theme === 'light' ? 'border-slate-200/80 bg-white/80' : 'border-white/10 bg-slate-950/70'
        )}
      >
        <div
          className={cn(
            'flex items-end gap-2 rounded-3xl px-3 py-2 border transition focus-within:ring-2 focus-within:ring-indigo-500/70',
            theme === 'light' ? 'glass-panel-light shadow-sm' : 'glass-panel shadow-lg shadow-black/20'
          )}
        >
          <textarea
            rows={isWidget ? 1 : 2}
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder={composerPlaceholder}
            aria-label="Message composer"
            className={cn(
              'flex-1 bg-transparent text-sm resize-none outline-none text-left placeholder:opacity-60',
              theme === 'light' ? 'placeholder:text-slate-400 text-slate-900' : 'placeholder:text-white/40 text-white'
            )}
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!allowSend}
            aria-label="Send message"
            className={cn(
              'shrink-0 shadow-lg shadow-indigo-500/30 transition-transform',
              allowSend ? 'hover:-translate-y-0.5' : ''
            )}
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
          </Button>
        </div>
        <div
          className={cn(
            'flex items-center justify-between text-[11px] pt-2',
            theme === 'light' ? 'text-slate-400' : 'text-white/40'
          )}
        >
          <span>Shift + Enter for a new line</span>
          {isSending ? <span>Agent is crafting a reply…</span> : <span>Press Enter to send</span>}
        </div>
      </div>
    </div>
  );
}
