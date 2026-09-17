import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StudyReadinessScorecard } from '../StudyReadinessScorecard';
import type { StudyReadinessResult } from '@/lib/study-tools';

const mockReadiness: StudyReadinessResult = {
  topic: 'Calculus II',
  targetExam: 'Midterm Exam',
  readinessScore: 78,
  gradeTier: 'B',
  status: 'Proficient',
  estimatedHoursStudied: 12,
  subtopicBreakdown: [
    {
      name: 'Integration by Parts',
      mastery: 85,
      targetMastery: 85,
      priority: 'Low',
      recommendedHours: 1,
      status: 'Mastered',
    },
    {
      name: 'Taylor Series',
      mastery: 65,
      targetMastery: 85,
      priority: 'High',
      recommendedHours: 3,
      status: 'Priority Focus',
    },
  ],
  strengths: ['Basic substitution', 'Integration by parts'],
  weaknesses: ['Convergence tests for Taylor series'],
  actionPlan: [
    'Focus on ratio and root tests for series convergence.',
    'Complete 5 practice problems on partial fractions.',
  ],
  evaluatedAt: 'Today at 2:00 PM',
};

describe('StudyReadinessScorecard Component (Tool Result Component)', () => {
  it('renders overall readiness percentage score, target exam, and status tier', () => {
    render(<StudyReadinessScorecard data={mockReadiness} />);

    // Query strictly by accessible text without CSS class coupling
    expect(screen.getByText('Calculus II')).toBeInTheDocument();
    expect(screen.getByText('Midterm Exam')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText(/Proficient \(B\)/)).toBeInTheDocument();
  });

  it('renders subtopics mastery breakdown, target thresholds, and actionable recommendations', () => {
    render(<StudyReadinessScorecard data={mockReadiness} />);

    expect(screen.getByText('Integration by Parts')).toBeInTheDocument();
    expect(screen.getByText('Taylor Series')).toBeInTheDocument();

    // Action plan items rendered clearly
    expect(
      screen.getByText('Focus on ratio and root tests for series convergence.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Complete 5 practice problems on partial fractions.')
    ).toBeInTheDocument();
  });
});
