'use client';

import React, { useRef } from 'react';
import { Send, Square } from 'lucide-react';

export interface ChatInputFormProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (text: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  placeholder?: string;
}

export function ChatInputForm({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
  placeholder = 'Ask a question or evaluate study readiness...',
}: ChatInputFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    // Rejection rule: Reject empty or whitespace-only input
    if (!trimmed || isLoading) return;

    onSubmit(trimmed);
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-background border border-border rounded-xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/50 transition-shadow"
      aria-label="Chat input form"
    >
      <input
        ref={inputRef}
        aria-label="Chat message input"
        className="flex-1 bg-transparent px-4 py-2.5 outline-none text-foreground placeholder:text-muted-foreground text-base md:text-sm min-w-0"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
      />

      {isLoading ? (
        <button
          type="button"
          onClick={onStop}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex-shrink-0 cursor-pointer"
          aria-label="Stop generation"
        >
          <Square size={16} className="fill-current" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      )}
    </form>
  );
}
