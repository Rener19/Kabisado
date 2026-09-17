'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function ChatSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex w-full justify-start mb-6"
    >
      <div className="flex w-full max-w-[95%] md:max-w-[85%] gap-3 flex-row">
        {/* Avatar Skeleton */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900/30 text-emerald-500/60 flex items-center justify-center border border-emerald-500/20 animate-pulse">
          <Sparkles size={16} />
        </div>

        {/* Bubble Skeleton */}
        <div className="flex flex-col gap-1.5 items-start min-w-0 flex-1">
          <div className="h-3 w-16 bg-muted-foreground/20 rounded animate-pulse" />
          
          <div className="w-full max-w-lg p-4 rounded-2xl rounded-tl-sm bg-card border border-border shadow-sm space-y-2.5">
            <div className="h-3.5 bg-muted-foreground/20 rounded-md w-11/12 animate-pulse" />
            <div className="h-3.5 bg-muted-foreground/15 rounded-md w-4/5 animate-pulse" />
            <div className="h-3.5 bg-muted-foreground/15 rounded-md w-3/5 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
