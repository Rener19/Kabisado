import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ChatErrorBanner } from '../ChatErrorBanner';

describe('ChatErrorBanner Component (Chat Failure & Retry State)', () => {
  it('renders nothing when error is null', () => {
    const { container } = render(
      <ChatErrorBanner
        error={null}
        onRetry={vi.fn()}
        onDismiss={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders accessible alert banner with raw error message and retry action', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    const handleDismiss = vi.fn();

    render(
      <ChatErrorBanner
        error={new Error('Network connection dropped mid-stream.')}
        lastPromptSnippet="Hash Tables"
        onRetry={handleRetry}
        onDismiss={handleDismiss}
      />
    );

    // Query strictly by accessible role and text (never test ID or CSS class)
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Network connection dropped mid-stream.')).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry sending: Hash Tables/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).not.toBeDisabled();

    // Click retry
    await user.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);

    // Click dismiss
    const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
    await user.click(dismissButton);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('parses structured JSON error payloads cleanly', () => {
    render(
      <ChatErrorBanner
        error={{ message: JSON.stringify({ error: 'Rate limit exceeded: 429 Too Many Requests.' }) }}
        onRetry={vi.fn()}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Rate limit exceeded: 429 Too Many Requests.')).toBeInTheDocument();
  });

  it('disables retry button while loading or retrying', () => {
    render(
      <ChatErrorBanner
        error={new Error('Server failure')}
        isRetrying={true}
        onRetry={vi.fn()}
        onDismiss={vi.fn()}
      />
    );

    const retryButton = screen.getByRole('button', { name: /retry sending/i });
    expect(retryButton).toBeDisabled();
  });
});
