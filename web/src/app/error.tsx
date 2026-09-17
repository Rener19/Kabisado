'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred in the application. We’ve logged the issue and you can safely reload the page or return home.
          </p>
          {error?.digest && (
            <span className="inline-block text-[10px] font-mono text-muted-foreground/60 bg-muted px-2 py-0.5 rounded">
              Error ID: {error.digest}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-border"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
