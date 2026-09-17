import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StatefulButton } from '../StatefulButton';

describe('StatefulButton Component (Motion State Machine)', () => {
  it('renders resting state with accessible attributes and label', () => {
    render(
      <StatefulButton
        idleText="Generate Study Notes"
        loadingText="Generating..."
        successText="Notes Ready!"
        errorText="Failed — Click to Retry"
      />
    );

    const button = screen.getByRole('button', { name: 'Generate Study Notes' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-busy', 'false');
    expect(button).not.toBeDisabled();
  });

  it('reflects controlled loading state with aria-busy="true" and loading label', () => {
    render(
      <StatefulButton
        idleText="Generate Study Notes"
        loadingText="Synthesizing..."
        state="loading"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByText('Synthesizing...')).toBeInTheDocument();
  });

  it('reflects controlled success and error states accurately', () => {
    const { rerender } = render(
      <StatefulButton
        idleText="Save Deck"
        successText="Deck Saved!"
        state="success"
      />
    );

    expect(screen.getByText('Deck Saved!')).toBeInTheDocument();

    rerender(
      <StatefulButton
        idleText="Save Deck"
        errorText="Sync Failed — Retry"
        state="error"
      />
    );

    expect(screen.getByText('Sync Failed — Retry')).toBeInTheDocument();
  });

  it('executes async lifecycle on click and guards against double clicks during execution', async () => {
    const user = userEvent.setup();
    let resolveAction: () => void = () => {};
    const asyncAction = vi.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        resolveAction = resolve;
      });
    });

    render(
      <StatefulButton
        idleText="Submit Request"
        loadingText="Working..."
        successText="Done!"
        onClick={asyncAction}
      />
    );

    const button = screen.getByRole('button', { name: 'Submit Request' });

    // First click initiates async action
    await user.click(button);

    expect(asyncAction).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Working...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Second click during in-flight request is guarded against
    await user.click(button);
    expect(asyncAction).toHaveBeenCalledTimes(1);

    // Resolve the promise and assert state transition to success
    await act(async () => {
      resolveAction();
    });

    expect(await screen.findByText('Done!')).toBeInTheDocument();
  });
});
