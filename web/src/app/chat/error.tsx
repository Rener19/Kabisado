'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';

interface ChatErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChatError({ error, reset }: ChatErrorProps) {
  useEffect(() => {
    console.error('Chat Route Error Boundary caught:', error);
  }, [error]);

  const handleResetSession = () => {
    try {
      localStorage.removeItem('kabisado_chat_history');
    } catch {
      // Ignore localstorage errors
    }
    reset();
  };

  return (
    <div className="h-[80vh] w-full max-w-4xl mx-auto flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Chat Route Encountered an Issue</h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            The study copilot interface was interrupted by an unexpected error. You can retry loading the interface or start a fresh session.
          </p>
          {error?.message && (
            <p className="text-xs font-mono text-rose-400 bg-rose-950/20 border border-rose-500/20 p-2.5 rounded-lg break-words text-left">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Reload Chat Interface
          </button>
          <button
            onClick={handleResetSession}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-border"
          >
            <MessageSquare className="w-4 h-4" /> Clear & Reset Session
          </button>
        </div>
      </div>
    </div>
  );
}
