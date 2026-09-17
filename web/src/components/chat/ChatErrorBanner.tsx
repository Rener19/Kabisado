import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RotateCcw, Loader2, X } from 'lucide-react';

export interface ChatErrorBannerProps {
  error: Error | { message?: string } | null;
  lastPromptSnippet?: string;
  isLoading?: boolean;
  isRetrying?: boolean;
  onRetry: () => void;
  onDismiss: () => void;
}

export function ChatErrorBanner({
  error,
  lastPromptSnippet = 'last request',
  isLoading = false,
  isRetrying = false,
  onRetry,
  onDismiss,
}: ChatErrorBannerProps) {
  if (!error) return null;

  const errorMessage = (() => {
    if (!error.message) return 'The AI stream encountered a network or server hiccup.';
    try {
      const parsed = JSON.parse(error.message);
      return parsed.error || parsed.message || error.message;
    } catch {
      return error.message;
    }
  })();

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        aria-live="assertive"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="px-4 py-3 bg-amber-500/10 dark:bg-amber-950/30 border-t border-amber-500/30 text-amber-950 dark:text-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0"
      >
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <span className="font-semibold text-foreground mr-1.5">Generation Interrupted:</span>
            <span className="text-muted-foreground truncate inline-block max-w-xs md:max-w-md align-bottom">
              {errorMessage}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading || isRetrying}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            aria-label={`Retry sending: ${lastPromptSnippet}`}
          >
            {isRetrying ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>Retry {lastPromptSnippet !== 'last request' ? `"${lastPromptSnippet}"` : ''}</span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
