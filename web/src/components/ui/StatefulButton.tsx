'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Loader2, Check, AlertCircle, Sparkles, LucideIcon } from 'lucide-react';

export type ButtonLifecycleState = 'idle' | 'loading' | 'success' | 'error';

export interface StatefulButtonProps {
  /** Text shown during resting state */
  idleText: string;
  /** Text shown during async operation */
  loadingText?: string;
  /** Text shown on successful completion */
  successText?: string;
  /** Text shown on failure / error */
  errorText?: string;
  /** Primary icon for resting state */
  icon?: LucideIcon;
  /** Icon shown on success */
  successIcon?: LucideIcon;
  /** Icon shown on error */
  errorIcon?: LucideIcon;
  /** Visual variant styling */
  variant?: 'primary' | 'secondary' | 'outline';
  /** External state control (optional; if omitted, controlled via onClick promise) */
  state?: ButtonLifecycleState;
  /** Callback fired on click. Returning a Promise triggers loading -> success/error automatically */
  onClick?: () => Promise<void> | void;
  /** Disabled attribute */
  disabled?: boolean;
  /** Additional custom classNames */
  className?: string;
  /** Speed multiplier for inspecting motion (e.g. 0.5 for 2x slower, 1 for normal) */
  speedMultiplier?: number;
  /** Force reduced motion for demonstration purposes */
  forceReducedMotion?: boolean;
  /** Accessible label description */
  ariaLabel?: string;
}

export function StatefulButton({
  idleText,
  loadingText = 'Processing...',
  successText = 'Complete!',
  errorText = 'Failed — Click to retry',
  icon: Icon = Sparkles,
  successIcon: SuccessIcon = Check,
  errorIcon: ErrorIcon = AlertCircle,
  variant = 'primary',
  state: controlledState,
  onClick,
  disabled = false,
  className = '',
  speedMultiplier = 1,
  forceReducedMotion = false,
  ariaLabel,
}: StatefulButtonProps) {
  // Internal state when not externally controlled
  const [internalState, setInternalState] = useState<ButtonLifecycleState>('idle');
  const currentState = controlledState ?? internalState;

  // Reduced motion preference
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = forceReducedMotion || Boolean(systemReducedMotion);

  // Timeouts ref to ensure clean lifecycle unmounting
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const buttonId = useId();

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Duration calculations based on speed multiplier
  const durationScale = 1 / Math.max(speedMultiplier, 0.1);

  // Automatically ease back from success to idle after 1800ms
  useEffect(() => {
    if (currentState === 'success') {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        if (!controlledState) {
          setInternalState('idle');
        }
      }, 1800 * durationScale);
    }
  }, [currentState, controlledState, durationScale]);

  // Click handler with interruptibility guard
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || currentState === 'loading') {
      e.preventDefault();
      return;
    }

    if (!onClick) return;

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    // If already in error state and clicked, treat as a retry
    if (currentState === 'error') {
      setInternalState('loading');
    }

    try {
      const result = onClick();
      if (result instanceof Promise) {
        setInternalState('loading');
        await result;
        setInternalState('success');
      }
    } catch (err) {
      console.warn('StatefulButton handled lifecycle error:', (err as Error)?.message || err);
      setInternalState('error');
    }
  };

  // Base style configurations by variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/80 shadow-xs';
      case 'outline':
        return 'bg-background/80 hover:bg-muted text-foreground border border-border hover:border-primary/50 shadow-xs';
      case 'primary':
      default:
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 shadow-md shadow-emerald-950/20';
    }
  };

  // Dynamic feedback styling based on lifecycle state
  const getStateOverlay = () => {
    if (disabled) {
      return 'opacity-50 cursor-not-allowed grayscale pointer-events-none';
    }
    switch (currentState) {
      case 'loading':
        return 'cursor-wait border-emerald-500/50 brightness-95';
      case 'success':
        return '!bg-emerald-600 !border-emerald-400 !text-white !shadow-emerald-500/30 ring-2 ring-emerald-400/40';
      case 'error':
        return '!bg-rose-600 !border-rose-400 !text-white !shadow-rose-500/30 ring-2 ring-rose-400/40';
      case 'idle':
      default:
        return 'hover:brightness-105 active:brightness-95';
    }
  };

  // Error shake animation keyframes (compositor translateX only)
  const shakeKeyframes = shouldReduceMotion
    ? { x: 0 }
    : { x: [0, -7, 7, -5, 5, -2, 2, 0] };

  // Content transition variants (compositor translateY & opacity only)
  const contentVariants = {
    initial: {
      y: shouldReduceMotion ? 0 : 12,
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.96,
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.22 * durationScale,
        ease: [0.16, 1, 0.3, 1] as const, // ease-out cubic
      },
    },
    exit: {
      y: shouldReduceMotion ? 0 : -12,
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.96,
      transition: {
        duration: shouldReduceMotion ? 0.08 : 0.16 * durationScale,
        ease: [0.7, 0, 0.84, 0] as const, // ease-in cubic
      },
    },
  };

  return (
    <motion.button
      id={buttonId}
      layout
      onClick={handleClick}
      disabled={disabled || currentState === 'loading'}
      aria-busy={currentState === 'loading'}
      aria-live="polite"
      aria-label={ariaLabel || idleText}
      // Tactile physical feedback on hover and press
      whileHover={
        disabled || currentState === 'loading'
          ? {}
          : {
              y: shouldReduceMotion ? 0 : -1,
              transition: { duration: 0.15 * durationScale, ease: 'easeOut' },
            }
      }
      whileTap={
        disabled || currentState === 'loading'
          ? {}
          : {
              scale: shouldReduceMotion ? 1 : 0.97,
              transition: { duration: 0.1 * durationScale, ease: 'easeIn' },
            }
      }
      // Error shake motion
      animate={currentState === 'error' ? shakeKeyframes : { x: 0 }}
      transition={
        currentState === 'error'
          ? {
              duration: shouldReduceMotion ? 0.05 : 0.4 * durationScale,
              ease: 'easeInOut',
            }
          : {
              layout: {
                type: 'spring',
                stiffness: 420,
                damping: 30,
              },
            }
      }
      className={`relative inline-flex items-center justify-center font-semibold text-sm px-5 py-2.5 rounded-xl select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors cursor-pointer min-w-[140px] overflow-hidden ${getVariantStyles()} ${getStateOverlay()} ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {currentState === 'idle' && (
          <motion.span
            key="idle"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            <span>{idleText}</span>
          </motion.span>
        )}

        {currentState === 'loading' && (
          <motion.span
            key="loading"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Loader2
              className="w-4 h-4 flex-shrink-0 animate-spin"
              style={{
                animationDuration: `${0.85 * durationScale}s`,
              }}
            />
            <span>{loadingText}</span>
          </motion.span>
        )}

        {currentState === 'success' && (
          <motion.span
            key="success"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <motion.div
              initial={shouldReduceMotion ? {} : { scale: 0.4, rotate: -30 }}
              animate={shouldReduceMotion ? {} : { scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 24,
                delay: 0.05 * durationScale,
              }}
            >
              <SuccessIcon className="w-4 h-4 flex-shrink-0" />
            </motion.div>
            <span>{successText}</span>
          </motion.span>
        )}

        {currentState === 'error' && (
          <motion.span
            key="error"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <ErrorIcon className="w-4 h-4 flex-shrink-0" />
            <span>{errorText}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
