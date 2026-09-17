'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Bookmark, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Accessibility, 
  Layers, 
  Activity,
  Sliders,
  RotateCcw,
  Zap
} from 'lucide-react';
import { StatefulButton, type ButtonLifecycleState } from '@/components/ui/StatefulButton';

export default function StatefulButtonsDemoPage() {
  // Manual state control for testing
  const [manualState, setManualState] = useState<ButtonLifecycleState | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [forceReducedMotion, setForceReducedMotion] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [eventLog, setEventLog] = useState<Array<{ id: string; time: string; event: string }>>([]);

  const logEvent = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setEventLog((prev) => [{ id: Math.random().toString(), time, event: msg }, ...prev.slice(0, 7)]);
  };

  // Orchestrate lifecycle transitions safely without uncaught promise rejections
  const triggerLifecycle = (targetOutcome: 'success' | 'error' | 'random') => {
    setManualState('loading');
    logEvent(`Sandbox trigger fired → transitioning to [loading] (Target: ${targetOutcome.toUpperCase()})`);

    const delay = 900 / speedMultiplier;

    setTimeout(() => {
      let resolvedState: ButtonLifecycleState = 'success';
      if (targetOutcome === 'error') {
        resolvedState = 'error';
        logEvent('Operation failed (simulated 500 error) → button entered [error] state with shake');
      } else if (targetOutcome === 'success') {
        resolvedState = 'success';
        logEvent('Operation succeeded (200 OK) → button entered [success] state with checkmark');
      } else {
        const didFail = Math.random() < 0.2;
        resolvedState = didFail ? 'error' : 'success';
        logEvent(
          didFail
            ? 'Random action failed (20% rate) → button entered [error] state'
            : 'Random action succeeded → button entered [success] state'
        );
      }

      setManualState(resolvedState);

      // If it resolved to success, return to idle after 1800ms hold
      if (resolvedState === 'success') {
        setTimeout(() => {
          setManualState((prev) => (prev === 'success' ? 'idle' : prev));
          logEvent('Success hold ended → state machine returned to [idle]');
        }, 1800 / speedMultiplier);
      }
    }, delay);
  };

  // Handler for direct clicks on the buttons
  const handleDirectClick = async () => {
    setManualState(null);
    logEvent('Direct button click received → processing request');
    const delay = Math.floor(Math.random() * 400 + 700) / speedMultiplier;
    const willFail = Math.random() < 0.2; // 20% failure rate

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (willFail) {
      logEvent('Direct action failed (20% threshold reached) → button entering [error] state');
      throw new Error('Simulated request timeout');
    } else {
      logEvent('Direct action resolved successfully → button entering [success] state');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation & Header */}
        <div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Kabisado Chat
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Motion System Showcase
                </span>
                <span className="text-xs text-muted-foreground">Interactive State Machine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Stateful Action Buttons
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                A component that communicates state through intentional physics. No abrupt swaps: transitions choreograph every lifecycle phase from resting to async resolution.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-mono text-muted-foreground">
                <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                Live State: <strong className="text-foreground">{manualState || 'auto-managed'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Live Interactive Stage */}
        <div className="p-8 sm:p-12 rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Interactive Component Stage
            </span>
            <p className="text-xs text-muted-foreground">
              Click either button to run the full lifecycle. Notice the morphing width, vertical text transitions, and compositor-friendly feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-y border-border/60">
            {/* Button 1: Primary AI Generation Action */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground">Button 1 (Hero Action)</span>
              <StatefulButton
                idleText="Generate Study Set"
                loadingText="Synthesizing..."
                successText="Deck Ready!"
                errorText="Failed — Click to Retry"
                icon={Sparkles}
                variant="primary"
                state={manualState ?? undefined}
                disabled={isDisabled}
                speedMultiplier={speedMultiplier}
                forceReducedMotion={forceReducedMotion}
                onClick={handleDirectClick}
                className="w-56"
              />
            </div>

            {/* Button 2: Secondary Library Action (Proving the System) */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground">Button 2 (Secondary Action)</span>
              <StatefulButton
                idleText="Save to Library"
                loadingText="Syncing..."
                successText="Saved to Cloud!"
                errorText="Sync Failed — Retry"
                icon={Bookmark}
                variant="secondary"
                state={manualState ?? undefined}
                disabled={isDisabled}
                speedMultiplier={speedMultiplier}
                forceReducedMotion={forceReducedMotion}
                onClick={handleDirectClick}
                className="w-52"
              />
            </div>
          </div>

          {/* Sandbox Controls Deck */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-emerald-500" />
              <span>Sandbox Trigger Deck</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => triggerLifecycle('success')}
                className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Force Success</span>
              </button>

              <button
                onClick={() => triggerLifecycle('error')}
                className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Force Error (Shake)</span>
              </button>

              <button
                onClick={() => triggerLifecycle('random')}
                className="p-3 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary-foreground text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Random (20% Fail)</span>
              </button>

              <button
                onClick={() => {
                  setManualState('idle');
                  logEvent('Manual reset triggered → state set to [idle]');
                }}
                className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Idle</span>
              </button>
            </div>

            {/* Accessibility & Inspection Toggles */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs border-t border-border/50">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDisabled}
                    onChange={(e) => setIsDisabled(e.target.checked)}
                    className="rounded border-border accent-emerald-500"
                  />
                  <span>Disabled State</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-emerald-400">
                  <Accessibility className="w-3.5 h-3.5" />
                  <input
                    type="checkbox"
                    checked={forceReducedMotion}
                    onChange={(e) => setForceReducedMotion(e.target.checked)}
                    className="rounded border-border accent-emerald-500"
                  />
                  <span>Simulate Reduced Motion</span>
                </label>
              </div>

              {/* Speed Multiplier */}
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Speed:</span>
                {[1, 0.5, 0.25].map((multiplier) => (
                  <button
                    key={multiplier}
                    onClick={() => setSpeedMultiplier(multiplier)}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                      speedMultiplier === multiplier
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    {multiplier === 1 ? '1x (Normal)' : multiplier === 0.5 ? '0.5x (Slow)' : '0.25x (Super Slow)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Event Log Terminal */}
          <div className="p-3.5 rounded-xl bg-background/80 border border-border text-[11px] font-mono space-y-1">
            <span className="text-muted-foreground font-semibold block mb-1">Live State Transition Log:</span>
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground/60 italic">No events yet. Click any button or trigger above.</span>
            ) : (
              eventLog.map((log) => (
                <div key={log.id} className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-emerald-500">[{log.time}]</span>
                  <span className="text-foreground">{log.event}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Motion & Timing Design Rationale Note */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex items-center gap-2 text-base font-bold text-foreground">
            <Layers className="w-5 h-5 text-emerald-500" />
            <h2>Motion Design & Timing Rationale</h2>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Every state change in the <code>StatefulButton</code> is a carefully tuned physics transition rather than an instantaneous swap. Durations match the biological threshold of human perception (100–400ms), ensuring interactions feel responsive, physical, and communicative.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-2.5 px-3 font-bold text-foreground">State Phase</th>
                  <th className="py-2.5 px-3 font-bold text-foreground">Duration</th>
                  <th className="py-2.5 px-3 font-bold text-foreground">Easing / Spring</th>
                  <th className="py-2.5 px-3 font-bold text-foreground">Psychological & Usability Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="py-2 px-3 font-semibold text-foreground">Hover / Focus</td>
                  <td className="py-2 px-3 font-mono text-emerald-400">150ms</td>
                  <td className="py-2 px-3 font-mono">ease-out</td>
                  <td className="py-2 px-3 text-muted-foreground">Immediate acknowledgment of pointer presence without feeling nervous.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-foreground">Active (Press)</td>
                  <td className="py-2 px-3 font-mono text-emerald-400">100ms</td>
                  <td className="py-2 px-3 font-mono">scale(0.97)</td>
                  <td className="py-2 px-3 text-muted-foreground">Tactile haptic impression of a physical switch being depressed under the finger.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-foreground">Label Exit → Enter</td>
                  <td className="py-2 px-3 font-mono text-emerald-400">160ms / 220ms</td>
                  <td className="py-2 px-3 font-mono">cubic-bezier(0.16, 1, 0.3, 1)</td>
                  <td className="py-2 px-3 text-muted-foreground">Out-going text slides upward quickly while new incoming status slides smoothly into focus.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-foreground">Width Morphing</td>
                  <td className="py-2 px-3 font-mono text-emerald-400">Spring</td>
                  <td className="py-2 px-3 font-mono">stiffness: 420, damping: 30</td>
                  <td className="py-2 px-3 text-muted-foreground">Smooth organic expansion/contraction to fit varying label lengths with zero layout thrash.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-foreground">Success Hold</td>
                  <td className="py-2 px-3 font-mono text-emerald-400">1800ms</td>
                  <td className="py-2 px-3 font-mono">Spring pop (1.05)</td>
                  <td className="py-2 px-3 text-muted-foreground">Ample time for the human visual cortex to register successful completion before returning to idle.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-foreground">Error Shake</td>
                  <td className="py-2 px-3 font-mono text-emerald-400">400ms</td>
                  <td className="py-2 px-3 font-mono">keyframes x [-7, 7, -5, 5, 0]</td>
                  <td className="py-2 px-3 text-muted-foreground">High-frequency horizontal tremor universally communicating refusal. Suppressed under reduced motion.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2 text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Accessibility className="w-4 h-4 text-emerald-500" />
              Accessibility & Compositor Guarantees
            </span>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li><strong>Compositor-Friendly:</strong> Only <code>transform</code> (scale, translate) and <code>opacity</code> are animated, avoiding layout recalcs or Cumulative Layout Shift (CLS).</li>
              <li><strong>Reduced Motion Compliance:</strong> Automatically reads <code>prefers-reduced-motion</code>. Suppresses physical shakes and aggressive springs while keeping instantaneous color and state feedback.</li>
              <li><strong>Keyboard & Screen Readers:</strong> Full native <code>&lt;button&gt;</code> keyboard support (Space / Enter), prominent focus-visible ring, and <code>aria-busy</code> / <code>aria-live=&quot;polite&quot;</code> announcements.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
