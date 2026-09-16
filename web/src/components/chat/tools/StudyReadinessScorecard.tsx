'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, AlertTriangle, Clock, Target, Sparkles, TrendingUp } from 'lucide-react';
import type { StudyReadinessResult } from '@/lib/study-tools';

interface StudyReadinessScorecardProps {
  data: StudyReadinessResult;
}

export function StudyReadinessScorecard({ data }: StudyReadinessScorecardProps) {
  const {
    topic,
    targetExam,
    readinessScore,
    gradeTier,
    status,
    subtopicBreakdown,
    strengths,
    weaknesses,
    actionPlan,
    evaluatedAt,
  } = data;

  // Determine score theme colors
  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' };
    if (score >= 70) return { stroke: '#0ea5e9', bg: 'bg-sky-500/10', text: 'text-sky-500', border: 'border-sky-500/30' };
    if (score >= 55) return { stroke: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' };
    return { stroke: '#ef4444', bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/30' };
  };

  const theme = getScoreColor(readinessScore);
  const circumference = 2 * Math.PI * 38; // radius = 38
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  return (
    <div className="w-full my-3 rounded-2xl border border-border bg-card/95 text-card-foreground shadow-lg overflow-hidden backdrop-blur-sm">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.bg} ${theme.text} border ${theme.border}`}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                AI Knowledge Audit
              </span>
              <span className="text-xs text-muted-foreground">{evaluatedAt}</span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-foreground mt-0.5">{topic}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Target: <span className="font-medium text-foreground">{targetExam}</span>
            </p>
          </div>
        </div>

        {/* Readiness Status Pill */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${theme.bg} ${theme.text} ${theme.border}`}>
          <Sparkles className="w-3.5 h-3.5" />
          {status} ({gradeTier})
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Score & Gauge Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Gauge Widget */}
          <div className="flex items-center justify-center p-4 rounded-xl bg-background/50 border border-border/60">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={theme.stroke}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black tracking-tight text-foreground">{readinessScore}%</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Readiness</span>
              </div>
            </div>
          </div>

          {/* Highlights & Summary */}
          <div className="md:col-span-2 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-background/50 border border-border/60">
                <span className="text-[11px] font-medium text-muted-foreground block">Top Strengths</span>
                <span className="text-xs font-semibold text-emerald-500 line-clamp-1 mt-0.5">
                  {strengths.join(', ') || 'Core concepts'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border/60">
                <span className="text-[11px] font-medium text-muted-foreground block">High Priority Focus</span>
                <span className="text-xs font-semibold text-rose-400 line-clamp-1 mt-0.5">
                  {weaknesses.join(', ') || 'None critical'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-background/50 border border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Recommended Study Time:
              </span>
              <span className="font-bold text-foreground">
                {subtopicBreakdown.reduce((sum, item) => sum + item.recommendedHours, 0).toFixed(1)} hrs total
              </span>
            </div>
          </div>
        </div>

        {/* SVG Mastery Breakdown Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Subtopic Mastery vs Target (85%)
            </h4>
            <span className="text-[11px] text-muted-foreground">Target: 85%</span>
          </div>

          {/* Custom Responsive SVG Bar Chart */}
          <div className="w-full bg-background/60 p-4 rounded-xl border border-border/70 space-y-3">
            {subtopicBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground truncate max-w-[200px] md:max-w-[320px]">{item.name}</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-semibold">{item.mastery}%</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.status === 'Mastered'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.status === 'Review Needed'
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar with Target Marker */}
                <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      item.mastery >= 85
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : item.mastery >= 70
                        ? 'bg-gradient-to-r from-sky-500 to-blue-400'
                        : 'bg-gradient-to-r from-rose-500 to-amber-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.mastery}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                  />
                  {/* 85% Target Indicator Line */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-foreground/50 z-10" 
                    style={{ left: '85%' }} 
                    title="Target: 85%"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        {actionPlan && actionPlan.length > 0 && (
          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Next Steps & Recommendations
            </span>
            <ul className="space-y-1">
              {actionPlan.map((action, i) => (
                <li key={i} className="text-xs text-foreground/90 flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
