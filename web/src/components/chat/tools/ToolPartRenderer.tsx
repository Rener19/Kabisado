'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Wrench, Sparkles, Terminal, RefreshCw, Cpu } from 'lucide-react';
import { StudyReadinessScorecard } from './StudyReadinessScorecard';
import { InteractiveStudyDeck } from './InteractiveStudyDeck';

export interface ToolPartRendererProps {
  part: any;
}

export function ToolPartRenderer({ part }: ToolPartRendererProps) {
  // Extract tool name from either part.toolName or part.type (e.g. `tool-evaluateStudyReadiness`)
  const toolName: string =
    part.toolName ||
    (typeof part.type === 'string' && part.type.startsWith('tool-')
      ? part.type.replace('tool-', '')
      : 'studyTool');

  const state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error' | string =
    part.state || 'output-available';

  const input = part.input || {};
  const output = part.output;
  const errorText = part.errorText || (part as any).error;

  const friendlyToolTitle = (name: string) => {
    switch (name) {
      case 'evaluateStudyReadiness':
        return 'Study & Exam Readiness Evaluator';
      case 'generateStudyDeck':
        return 'Interactive Concept Flashcard Deck';
      default:
        return name.replace(/([A-Z])/g, ' $1').trim();
    }
  };

  // State 1: Input Streaming (Tool call arguments are streaming in)
  if (state === 'input-streaming') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full my-2.5 p-4 rounded-xl border border-purple-500/30 bg-purple-950/10 text-purple-200 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                1. Input Streaming
              </span>
              <span className="text-xs font-semibold text-foreground truncate">
                {friendlyToolTitle(toolName)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              Formulating structured parameter schema...
            </p>
          </div>
        </div>

        {/* Live Partial Parameter Stream Preview */}
        {input && Object.keys(input).length > 0 && (
          <div className="mt-3 p-2.5 rounded-lg bg-background/60 border border-purple-500/20 text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5 text-purple-400 mb-1 font-semibold">
              <Terminal className="w-3 h-3" /> Live Parameter Stream:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(input).map(([key, val]) => (
                <span key={key} className="px-2 py-0.5 rounded bg-muted/60 text-foreground border border-border/50">
                  <span className="text-purple-400">{key}:</span> {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // State 2: Input Available / Executing (Tool call received, server-side execute running)
  if (state === 'input-available') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full my-2.5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 text-emerald-200 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                2. Server Executing
              </span>
              <span className="text-xs font-semibold text-foreground truncate">
                {friendlyToolTitle(toolName)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Computing knowledge vectors and running verified server-side analysis...
            </p>
          </div>
        </div>

        {/* Input Parameters Summary Card */}
        {input && Object.keys(input).length > 0 && (
          <div className="mt-3 p-2.5 rounded-lg bg-background/60 border border-emerald-500/20 text-xs text-foreground/90">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Executing with parameters:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {input.topic && (
                <span className="px-2 py-1 rounded-md bg-muted border border-border">
                  📚 <strong>Topic:</strong> {input.topic}
                </span>
              )}
              {input.subject && (
                <span className="px-2 py-1 rounded-md bg-muted border border-border">
                  📖 <strong>Subject:</strong> {input.subject}
                </span>
              )}
              {input.targetExam && (
                <span className="px-2 py-1 rounded-md bg-muted border border-border">
                  🎯 <strong>Exam:</strong> {input.targetExam}
                </span>
              )}
              {input.subtopics && Array.isArray(input.subtopics) && (
                <span className="px-2 py-1 rounded-md bg-muted border border-border">
                  🧩 <strong>Subtopics:</strong> {input.subtopics.length} items
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // State 4: Output Error (Failed execution with designed, resilient error treatment)
  if (state === 'output-error' || errorText) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full my-3 p-4 md:p-5 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-background to-amber-950/10 text-card-foreground shadow-md backdrop-blur-sm"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                4. Tool Execution Failed
              </span>
              <span className="text-xs text-muted-foreground">{friendlyToolTitle(toolName)}</span>
            </div>

            <h4 className="text-sm font-bold text-foreground">
              Unable to complete {friendlyToolTitle(toolName)}
            </h4>

            <p className="text-xs text-rose-300/90 leading-relaxed">
              {errorText || 'An unexpected error occurred while executing the server-side analysis.'}
            </p>

            <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">
                Tip: Try rephrasing your topic with specific course modules or subtopics.
              </span>
              <button
                onClick={() => window.location.reload()}
                className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Session
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // State 3: Output Available (Tool successfully executed, rendered as rich component)
  if (state === 'output-available' && output) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {toolName === 'evaluateStudyReadiness' ? (
          <StudyReadinessScorecard data={output} />
        ) : toolName === 'generateStudyDeck' ? (
          <InteractiveStudyDeck data={output} />
        ) : (
          /* Fallback generic tool component if model calls an unexpected tool */
          <div className="w-full my-3 p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {friendlyToolTitle(toolName)}
              </span>
            </div>
            <pre className="text-xs font-mono p-3 bg-muted rounded-lg overflow-x-auto">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        )}
      </motion.div>
    );
  }

  return null;
}
