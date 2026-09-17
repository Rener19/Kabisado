import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ChatInputForm } from '../ChatInputForm';

describe('ChatInputForm Component (Validated Form)', () => {
  it('renders with accessible form role, input label, and disabled send button when input is empty', () => {
    const setInput = vi.fn();
    const onSubmit = vi.fn();

    render(
      <ChatInputForm
        input=""
        setInput={setInput}
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    // Query strictly by accessible role and label (never test ID or CSS class)
    const input = screen.getByRole('textbox', { name: 'Chat message input' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');

    const sendButton = screen.getByRole('button', { name: 'Send message' });
    expect(sendButton).toBeInTheDocument();
    expect(sendButton).toBeDisabled();
  });

  it('keeps submit button disabled and rejects submit when input contains only whitespace', async () => {
    const user = userEvent.setup();
    const setInput = vi.fn();
    const onSubmit = vi.fn();

    render(
      <ChatInputForm
        input="     "
        setInput={setInput}
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    const sendButton = screen.getByRole('button', { name: 'Send message' });
    expect(sendButton).toBeDisabled();

    // Attempting to click disabled button must not trigger onSubmit
    await user.click(sendButton);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('enables submit button when valid text is present and fires onSubmit with trimmed text on click', async () => {
    const user = userEvent.setup();
    let currentInput = 'Explain DNS resolution';
    const setInput = vi.fn((val) => {
      currentInput = val;
    });
    const onSubmit = vi.fn();

    const { rerender } = render(
      <ChatInputForm
        input={currentInput}
        setInput={setInput}
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    const sendButton = screen.getByRole('button', { name: 'Send message' });
    expect(sendButton).toBeEnabled();

    await user.click(sendButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('Explain DNS resolution');
    expect(setInput).toHaveBeenCalledWith('');
  });

  it('submits valid input when pressing Enter key on the text field', async () => {
    const user = userEvent.setup();
    const setInput = vi.fn();
    const onSubmit = vi.fn();

    render(
      <ChatInputForm
        input="What is TCP three-way handshake?"
        setInput={setInput}
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Chat message input' });
    await user.type(input, '{enter}');

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('What is TCP three-way handshake?');
  });

  it('renders stop generation button when isLoading is true and fires onStop', async () => {
    const user = userEvent.setup();
    const setInput = vi.fn();
    const onSubmit = vi.fn();
    const onStop = vi.fn();

    render(
      <ChatInputForm
        input=""
        setInput={setInput}
        onSubmit={onSubmit}
        isLoading={true}
        onStop={onStop}
      />
    );

    // When loading, Send button is replaced by Stop generation button
    expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument();

    const stopButton = screen.getByRole('button', { name: 'Stop generation' });
    expect(stopButton).toBeInTheDocument();

    await user.click(stopButton);
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
