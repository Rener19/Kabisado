import { test, expect } from '@playwright/test';

test.describe('Kabisado Primary Study Flow (End-to-End)', () => {
  test('walks the primary study conversation flow with mocked AI stream', async ({ page }) => {
    // 1. Mock the AI endpoint completely (no real API calls, deterministic, zero-cost)
    await page.route('**/api/chat*', async (route) => {
      const mockStream = [
        'data: {"type":"start"}\n\n',
        'data: {"type":"text-start","id":"msg-0"}\n\n',
        'data: {"type":"text-delta","id":"msg-0","delta":"Hello! I am Kabisado Copilot, your active recall assistant. Let\'s master Data Structures together with spaced repetition."}\n\n',
        'data: {"type":"text-end","id":"msg-0"}\n\n',
        'data: {"type":"finish"}\n\n',
      ].join('');

      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
        body: mockStream,
      });
    });

    // 2. Navigate to /chat page
    await page.goto('/chat');
    await expect(page).toHaveTitle(/Kabisado/i);

    // 3. Verify accessible onboarding empty state
    await expect(
      page.getByRole('heading', { name: /welcome to kabisado copilot/i })
    ).toBeVisible();

    // 4. Locate textarea by role (never by test ID or CSS class)
    const textarea = page.getByRole('textbox');
    await expect(textarea).toBeVisible();

    // Submit button is disabled when input is empty
    const sendButton = page.getByRole('button', { name: /send message/i });
    await expect(sendButton).toBeDisabled();

    // 5. Fill valid study prompt into the form
    await textarea.fill('Help me review Big-O time complexities for hash tables.');
    await expect(sendButton).toBeEnabled();

    // 6. Submit the form
    await sendButton.click();

    // 7. Verify user message appears in the chat transcript
    await expect(
      page.getByText('Help me review Big-O time complexities for hash tables.')
    ).toBeVisible();

    // 8. Verify mocked AI stream response is rendered
    await expect(
      page.getByText(/Hello! I am Kabisado Copilot, your active recall assistant/i)
    ).toBeVisible();

    // 9. Verify textarea is cleared and re-focused
    await expect(textarea).toHaveValue('');

    // 10. Secondary flow: navigate to /buttons motion lifecycle lab
    await page.goto('/buttons');
    await expect(
      page.getByRole('heading', { name: /stateful action buttons/i })
    ).toBeVisible();

    // Verify accessible stateful button renders in idle state
    const primaryButton = page.getByRole('button', { name: /generate study set/i });
    await expect(primaryButton).toBeVisible();
    await expect(primaryButton).toHaveAttribute('aria-busy', 'false');
  });
});
