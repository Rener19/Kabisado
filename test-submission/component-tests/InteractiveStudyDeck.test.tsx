import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { InteractiveStudyDeck } from '../InteractiveStudyDeck';
import type { StudyDeckResult } from '@/lib/study-tools';

const mockDeck: StudyDeckResult = {
  deckId: 'deck-test-1',
  subject: 'Computer Science',
  deckTitle: 'Data Structures Mastery',
  totalCards: 2,
  difficultySummary: { easy: 1, medium: 1, hard: 0 },
  estimatedReviewMinutes: 4,
  cards: [
    {
      id: 'card-1',
      term: 'Hash Table',
      definition: 'A data structure that maps keys to values using a hash function.',
      mnemonic: 'Think of a library catalog mapping book codes to shelf locations.',
      practiceQuestion: 'What is the average time complexity for lookup in a hash table?',
      answer: 'O(1) constant time on average.',
      difficulty: 'easy',
    },
    {
      id: 'card-2',
      term: 'Binary Search Tree',
      definition: 'A node-based binary tree data structure with sorted invariants.',
      mnemonic: 'Left is lesser, right is greater.',
      practiceQuestion: 'What is the worst-case lookup complexity in an unbalanced BST?',
      answer: 'O(n) linear time when skewed.',
      difficulty: 'medium',
    },
  ],
  createdAt: 'Just now',
};

describe('InteractiveStudyDeck Component (Tool Result Component)', () => {
  it('renders deck title, subject header, progress bar, and challenge question', () => {
    render(<InteractiveStudyDeck data={mockDeck} />);

    // Query strictly by accessible text/role (never test ID or CSS classes)
    expect(screen.getByText('Data Structures Mastery')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(
      screen.getByText('What is the average time complexity for lookup in a hash table?')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Flashcard 1 of 2: click to flip and reveal answer/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/0\/2 Kabisado/)).toBeInTheDocument();
  });

  it('navigates across cards using the accessible Previous and Next buttons', async () => {
    const user = userEvent.setup();
    render(<InteractiveStudyDeck data={mockDeck} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeInTheDocument();

    // Advance to second card
    await user.click(nextButton);

    expect(
      screen.getByText('What is the worst-case lookup complexity in an unbalanced BST?')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Flashcard 2 of 2: click to flip and reveal answer/i })
    ).toBeInTheDocument();

    // Click previous to return to first card
    const prevButton = screen.getByRole('button', { name: /previous/i });
    await user.click(prevButton);

    expect(
      screen.getByText('What is the average time complexity for lookup in a hash table?')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Flashcard 1 of 2: click to flip and reveal answer/i })
    ).toBeInTheDocument();
  });

  it('reveals answer when flipping the card and toggles Kabisado mastery status', async () => {
    const user = userEvent.setup();
    render(<InteractiveStudyDeck data={mockDeck} />);

    // Click card to flip it via accessible button
    const cardButton = screen.getByRole('button', {
      name: /Flashcard 1 of 2: click to flip and reveal answer/i,
    });
    await user.click(cardButton);

    // Back side should now be revealed with concept name, answer, and definition
    expect(screen.getByText('Hash Table')).toBeInTheDocument();
    expect(
      screen.getByText('A data structure that maps keys to values using a hash function.')
    ).toBeInTheDocument();
    expect(screen.getByText('O(1) constant time on average.')).toBeInTheDocument();

    // Click Mark as Kabisado button
    const masteryButton = screen.getByRole('button', { name: /mark as kabisado/i });
    await user.click(masteryButton);

    // Progress counter updates
    expect(screen.getByText(/1\/2 Kabisado/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /kabisado!/i })).toBeInTheDocument();
  });
});
