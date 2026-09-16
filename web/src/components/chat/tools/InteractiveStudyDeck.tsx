'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronLeft, ChevronRight, RotateCw, CheckCircle, HelpCircle, Lightbulb, Sparkles } from 'lucide-react';
import type { StudyDeckResult } from '@/lib/study-tools';

interface InteractiveStudyDeckProps {
  data: StudyDeckResult;
}

export function InteractiveStudyDeck({ data }: InteractiveStudyDeckProps) {
  const { subject, deckTitle, cards, estimatedReviewMinutes, totalCards } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  const currentCard = cards[currentIndex] || cards[0];
  const isMastered = !!masteredCards[currentCard?.id];
  const masteredCount = Object.values(masteredCards).filter(Boolean).length;
  const progressPercent = Math.round((masteredCount / totalCards) * 100);

  const toggleMastery = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMasteredCards((prev) => ({
      ...prev,
      [currentCard.id]: !prev[currentCard.id],
    }));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const getDifficultyBadge = (diff: string) => {
    if (diff === 'easy') return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (diff === 'hard') return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
  };

  const diffBadge = getDifficultyBadge(currentCard?.difficulty || 'medium');

  return (
    <div className="w-full my-3 rounded-2xl border border-border bg-card/95 text-card-foreground shadow-lg overflow-hidden backdrop-blur-sm">
      {/* Deck Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Interactive Study Deck
              </span>
              <span className="text-xs text-muted-foreground">⏱ ~{estimatedReviewMinutes} min</span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-foreground mt-0.5">{deckTitle}</h3>
            <p className="text-xs text-muted-foreground">{subject}</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-foreground">
              {masteredCount}/{totalCards} Kabisado
            </span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Body */}
      <div className="p-4 md:p-6 space-y-4">
        {/* Card Container with 3D Flip */}
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative min-h-[230px] w-full rounded-xl cursor-pointer select-none perspective-1000 transition-transform active:scale-[0.99]"
        >
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              /* FRONT OF CARD */
              <motion.div
                key={`front-${currentIndex}`}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full min-h-[230px] p-5 md:p-6 rounded-xl bg-gradient-to-br from-background via-background to-muted/40 border border-border flex flex-col justify-between shadow-inner relative group"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffBadge.bg} ${diffBadge.text} ${diffBadge.border}`}>
                    {currentCard?.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-foreground transition-colors">
                    <RotateCw className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" /> Click to reveal answer
                  </span>
                </div>

                <div className="my-4 text-center space-y-2">
                  <h4 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight">
                    {currentCard?.term}
                  </h4>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground inline-flex items-center gap-2 max-w-lg mx-auto">
                    <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-left font-medium">{currentCard?.practiceQuestion}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Card {currentIndex + 1} of {totalCards}</span>
                  {isMastered && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              /* BACK OF CARD */
              <motion.div
                key={`back-${currentIndex}`}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full min-h-[230px] p-5 md:p-6 rounded-xl bg-gradient-to-br from-purple-950/20 via-background to-emerald-950/20 border border-purple-500/30 flex flex-col justify-between shadow-inner"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Concept Breakdown & Answer
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-purple-400" /> Flip back
                  </span>
                </div>

                <div className="my-3 space-y-3">
                  <p className="text-sm text-foreground/95 leading-relaxed font-medium">
                    {currentCard?.definition}
                  </p>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-emerald-200">Answer: </strong>
                      {currentCard?.answer}
                    </div>
                  </div>

                  {currentCard?.mnemonic && (
                    <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-purple-200">Memory Hook: </strong>
                        {currentCard.mnemonic}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <button
                    onClick={toggleMastery}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
                      isMastered
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-muted/60 text-muted-foreground hover:text-foreground border-border'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isMastered ? 'Kabisado!' : 'Mark as Kabisado'}
                  </button>

                  <span className="text-xs text-muted-foreground">Card {currentIndex + 1} of {totalCards}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Carousel Footer Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted transition-colors border border-border/50"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-1.5">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? 'w-6 bg-purple-400'
                    : masteredCards[cards[idx].id]
                    ? 'bg-emerald-400'
                    : 'bg-muted-foreground/30'
                }`}
                title={`Go to card ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted transition-colors border border-border/50"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
