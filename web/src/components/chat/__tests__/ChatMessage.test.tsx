import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChatMessage } from '../ChatMessage';
import type { UIMessage } from 'ai';

describe('ChatMessage Component', () => {
  it('renders user message text with accessible semantic structure', () => {
    const message: UIMessage = {
      id: 'msg-1',
      role: 'user',
      parts: [{ type: 'text', text: 'Can you explain the OSI model layers?' }],
    };

    render(<ChatMessage message={message} isLatest={false} />);

    // Query by role and accessible text (no test ID, no CSS class coupling)
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Can you explain the OSI model layers?')).toBeInTheDocument();
  });

  it('renders assistant markdown content with accessible external links', () => {
    const message: UIMessage = {
      id: 'msg-2',
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: 'Here is an overview. Learn more at [RFC 1122](https://tools.ietf.org/html/rfc1122).',
        },
      ],
    };

    render(<ChatMessage message={message} isLatest={false} />);

    expect(screen.getByText('Kabisado')).toBeInTheDocument();

    // Query link by role and accessible name
    const link = screen.getByRole('link', { name: 'RFC 1122' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://tools.ietf.org/html/rfc1122');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders thinking / pending state when assistant response has not emitted tokens yet', () => {
    const message: UIMessage = {
      id: 'msg-3',
      role: 'assistant',
      parts: [],
    };

    const { container } = render(<ChatMessage message={message} isLatest={true} />);

    // When latest message has no parts yet, thinking indicator container is present
    expect(screen.getByText('Kabisado')).toBeInTheDocument();
    expect(container.querySelector('[key="thinking"], .text-emerald-500')).toBeInTheDocument();
  });

  it('renders structured tool parts seamlessly within assistant messages', () => {
    const message: UIMessage = {
      id: 'msg-4',
      role: 'assistant',
      parts: [
        {
          type: 'tool-evaluateStudyReadiness',
          toolCallId: 'call-1',
          state: 'output-available',
          input: { topic: 'Computer Systems' },
          output: {
            topic: 'Computer Systems',
            targetExam: 'Midterm',
            readinessScore: 88,
            gradeTier: 'A',
            status: 'Exam Ready',
            evaluatedAt: 'Just now',
            strengths: ['Paging', 'Virtual Memory'],
            weaknesses: ['Deadlocks'],
            subtopicBreakdown: [
              {
                name: 'Virtual Memory',
                mastery: 90,
                targetMastery: 85,
                priority: 'Low',
                recommendedHours: 1,
                status: 'Mastered',
              },
            ],
            actionPlan: ['Review banker algorithm'],
          },
        },
      ],
    };

    render(<ChatMessage message={message} isLatest={false} />);

    expect(screen.getByText('Computer Systems')).toBeInTheDocument();
    expect(screen.getByText(/88%/)).toBeInTheDocument();
    expect(screen.getByText(/Exam Ready/)).toBeInTheDocument();
  });

  it('renders actively streaming partial text message chunks seamlessly', () => {
    const message: UIMessage = {
      id: 'msg-stream',
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: 'Analyzing memory complexity... [streaming token]',
        },
      ],
    };

    render(<ChatMessage message={message} isLatest={true} />);

    expect(
      screen.getByText('Analyzing memory complexity... [streaming token]')
    ).toBeInTheDocument();
    expect(screen.getByText('Kabisado')).toBeInTheDocument();
  });
});
