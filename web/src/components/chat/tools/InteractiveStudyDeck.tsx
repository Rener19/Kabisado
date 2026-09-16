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
  const [direction, setDirection] = useState(0);
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
    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleSelectCard = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setIsFlipped(false);
    setCurrentIndex(idx);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : dir < 0 ? -80 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : dir < 0 ? 80 : 0,
      opacity: 0,
    }),
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
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
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
                className="h-full bg-primary"
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
        {/* Carousel Slide Wrapper (removes flip when going to next/prev) */}
        <div className="relative w-full overflow-hidden min-h-[250px]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="w-full"
            >
              {/* Card Container with Ultra-Fast 3D Flip */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative min-h-[250px] w-full rounded-xl cursor-pointer select-none perspective-1000 transition-transform active:scale-[0.99]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {!isFlipped ? (
                    /* FRONT OF CARD: Question / Challenge only */
                    <motion.div
                      key="front"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.12, ease: 'easeOut' }}
                      className="w-full min-h-[250px] p-6 md:p-7 rounded-xl bg-card border-2 border-border hover:border-primary/50 flex flex-col justify-between shadow-sm relative group transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${diffBadge.bg} ${diffBadge.text} ${diffBadge.border}`}>
                          {currentCard?.difficulty || 'medium'}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 group-hover:text-primary transition-colors">
                          <RotateCw className="w-3.5 h-3.5 text-primary" /> Click card to flip & reveal answer
                        </span>
                      </div>

                      <div className="my-6 text-center space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                          <HelpCircle className="w-3.5 h-3.5" /> Question / Challenge
                        </div>
                        <h4 className="text-lg md:text-xl font-bold text-foreground leading-relaxed max-w-xl mx-auto">
                          {currentCard?.practiceQuestion || `What is the definition and application of "${currentCard?.term}"?`}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                        <span className="font-medium">Card {currentIndex + 1} of {totalCards}</span>
                        {isMastered && (
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Kabisado
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    /* BACK OF CARD: Fixed solid forest green (#064E3B), ultra-high contrast */
                    <motion.div
                      key="back"
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.12, ease: 'easeOut' }}
                      className="w-full min-h-[250px] p-6 md:p-7 rounded-xl bg-[#064E3B] border-2 border-emerald-500/50 text-white flex flex-col justify-between shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Answer & Key Concept
                        </span>
                        <span className="text-xs text-emerald-200/90 flex items-center gap-1.5">
                          <RotateCw className="w-3.5 h-3.5 text-emerald-400" /> Click to flip back
                        </span>
                      </div>

                      <div className="my-4 space-y-3">
                        {/* Core Term / Concept Name */}
                        <div className="border-b border-emerald-600/40 pb-2">
                          <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
                            Core Concept:
                          </span>
                          <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">
                            {currentCard?.term}
                          </h4>
                        </div>

                        {/* Direct Answer Box */}
                        <div className="p-3 rounded-xl bg-[#022C22] border border-emerald-500/40 text-sm text-white">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div className="leading-relaxed">
                              <strong className="font-bold text-emerald-300 mr-1.5">Answer:</strong>
                              <span className="text-white font-medium">{currentCard?.answer}</span>
                            </div>
                          </div>
                        </div>

                        {/* Concept Definition / Explanation if distinct */}
                        {currentCard?.definition && currentCard.definition !== currentCard.answer && (
                          <div className="text-xs md:text-sm text-emerald-100/90 leading-relaxed pt-1">
                            <strong className="font-semibold text-emerald-200">Explanation: </strong>
                            {currentCard.definition}
                          </div>
                        )}

                        {/* Memory Hook */}
                        {currentCard?.mnemonic && (
                          <div className="p-2.5 rounded-lg bg-[#022C22]/80 border border-emerald-600/40 text-xs text-emerald-100 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold text-amber-200">Memory Hook: </strong>
                              {currentCard.mnemonic}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer with Mastered Toggle */}
                      <div className="flex items-center justify-between pt-3 border-t border-emerald-600/50">
                        <button
                          onClick={toggleMastery}
                          className={`text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
                            isMastered
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                              : 'bg-[#022C22] hover:bg-[#022C22]/80 text-emerald-200 border border-emerald-600/60'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {isMastered ? 'Kabisado!' : 'Mark as Kabisado'}
                        </button>

                        <span className="text-xs text-emerald-200/80 font-medium">Card {currentIndex + 1} of {totalCards}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
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
                onClick={() => handleSelectCard(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? 'w-6 bg-primary'
                    : masteredCards[cards[idx].id]
                    ? 'bg-emerald-500'
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
