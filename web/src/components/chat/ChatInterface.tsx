'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { 
  Send, 
  Square, 
  ArrowDown, 
  RotateCcw, 
  AlertCircle, 
  BarChart3, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  GraduationCap, 
  X,
  Loader2
} from 'lucide-react';
import { DefaultChatTransport } from 'ai';
import { useSearchParams } from 'next/navigation';
import { ChatMessage } from './ChatMessage';
import { ChatSkeleton } from './ChatSkeleton';
import { ChatInputForm } from './ChatInputForm';
import { ChatErrorBanner } from './ChatErrorBanner';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { motion, AnimatePresence } from 'framer-motion';

const STARTER_PROMPTS = [
  {
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    label: 'Exam Evaluation',
    prompt: 'Evaluate my exam readiness for Calculus II (Integration by parts, Taylor series, Partial fractions) for my upcoming Midterm',
  },
  {
    icon: <Layers className="w-3.5 h-3.5" />,
    label: 'Flashcard Deck',
    prompt: 'Make a 5-card flashcard deck for Computer Networking',
  },
  {
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    label: 'Practice Quiz',
    prompt: 'Create a practice quiz on Cellular Respiration with 5 questions',
  },
  {
    icon: <BookOpen className="w-3.5 h-3.5" />,
    label: 'Concept Mastery',
    prompt: 'Explain the difference between TCP and UDP with real-world examples',
  },
];

export function ChatInterface() {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [input, setInput] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasLoadedHistory = useRef(false);
  
  const searchParams = useSearchParams();
  const sabotage = searchParams?.get('sabotage');
  const api = sabotage ? `/api/chat?sabotage=${encodeURIComponent(sabotage)}` : '/api/chat';

  const { messages, status, error, clearError, regenerate, sendMessage, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({ api }),
    throttle: 50,
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const { containerRef, isAtBottom, handleScroll, scrollToBottom } = useAutoScroll<HTMLDivElement>();

  // Extract the last user message for retry contextualization
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const lastPromptSnippet = (() => {
    if (!lastUserMessage) return 'last request';
    const msgData = lastUserMessage as { parts?: Array<{ type?: string; text?: string }>; content?: string };
    const textPart = msgData.parts?.find((p) => p.type === 'text');
    const raw = textPart?.text || msgData.content || 'last request';
    return raw.length > 30 ? `${raw.slice(0, 30)}...` : raw;
  })();

  // Restore chat history on initial mount
  useEffect(() => {
    if (hasLoadedHistory.current) return;
    hasLoadedHistory.current = true;
    const saved = localStorage.getItem('kabisado_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // Ignore corrupted storage
      }
    }
  }, [setMessages]);

  useEffect(() => {
    if (isMounted && messages.length > 0) {
      localStorage.setItem('kabisado_chat_history', JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  // Handle Retry Micro-Interaction with Debounce
  const handleRetry = async () => {
    if (isLoading || isRetrying) return;
    setIsRetrying(true);
    clearError();

    try {
      if (typeof regenerate === 'function') {
        await regenerate();
      } else if (lastPromptSnippet && lastPromptSnippet !== 'last request') {
        await sendMessage({ text: lastPromptSnippet });
      }
    } catch (e) {
      console.error('Retry failed:', e);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleStarterClick = (promptText: string) => {
    setInput(promptText);
    inputRef.current?.focus();
  };

  if (!isMounted) {
    return <div className="h-[80vh] w-full max-w-4xl mx-auto border border-border rounded-2xl bg-card animate-pulse" />;
  }

  // Determine whether to render the initial pending skeleton
  const isPendingFirstToken =
    isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user';

  return (
    <div className="flex flex-col h-[calc(100dvh-110px)] md:h-[82vh] w-full max-w-4xl mx-auto border border-border rounded-2xl overflow-hidden bg-background shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-base md:text-lg font-bold">Kabisado Copilot</h2>
        </div>
        <button 
          onClick={() => { 
            setMessages([]); 
            clearError();
            localStorage.removeItem('kabisado_chat_history'); 
          }}
          className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages Area (with Safari rubber-band prevention) */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth relative overscroll-y-contain"
      >
        {messages.length === 0 ? (
          /* Designed Onboarding Empty State */
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-4 md:p-8 space-y-6 my-auto">
            <div className="space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-xs">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                Welcome to Kabisado Copilot
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your AI study companion for active recall, exam readiness scoring, and instant interactive flashcards.
              </p>
            </div>

            <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
              {STARTER_PROMPTS.map((starter) => (
                <button
                  key={starter.label}
                  onClick={() => handleStarterClick(starter.prompt)}
                  className="p-3.5 rounded-xl border border-border bg-card/80 hover:bg-card hover:border-primary/50 text-card-foreground transition-all shadow-xs hover:shadow-sm text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="p-1 rounded-md bg-primary/10 text-primary">
                      {starter.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                      {starter.label}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug">
                    {starter.prompt}
                  </p>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground/80">
              💡 Tip: Click any starter card above to auto-fill your prompt.
            </p>
          </div>
        ) : (
          <>
            {messages.map((m, idx) => (
              <ChatMessage key={m.id} message={m} isLatest={idx === messages.length - 1} />
            ))}

            {/* Layout-Stable Skeleton while awaiting response */}
            {isPendingFirstToken && <ChatSkeleton />}
          </>
        )}
      </div>

      {/* Designed Error & Smart Retry Micro-Interaction Banner */}
      <ChatErrorBanner
        error={error}
        lastPromptSnippet={lastPromptSnippet}
        isLoading={isLoading}
        isRetrying={isRetrying}
        onRetry={handleRetry}
        onDismiss={clearError}
      />

      {/* Input Area (Mobile Safari Hardened with Safe Area Insets) */}
      <div className="p-3 md:p-4 bg-card border-t border-border relative flex-shrink-0 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        {/* Floating Jump to Bottom Button */}
        <AnimatePresence>
          {!isAtBottom && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => scrollToBottom()}
              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full py-1.5 px-4 shadow-md hover:bg-primary/90 transition-colors z-10 flex items-center gap-2 text-sm font-medium"
            >
              <ArrowDown size={14} /> Jump to latest
            </motion.button>
          )}
        </AnimatePresence>

        <ChatInputForm
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onStop={stop}
          onSubmit={(text) => {
            if (error) clearError();
            sendMessage({ text });
          }}
        />
      </div>
    </div>
  );
}
