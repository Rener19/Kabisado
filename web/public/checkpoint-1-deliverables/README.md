# Checkpoint 1 Deliverables: Resilient AI Chat Flow & Failure Handling

This directory contains the required deliverables for **Checkpoint 1** submission in the Portal:
- **Preview URLs** (Happy path & sabotage test triggers)
- **Visual Evidence Screenshots** (Happy path + 2 handled failure states + designed onboarding empty state)
- **Session Video Recording** demonstrating real-time recovery micro-interactions

---

## 1. Deliverable Artifacts Directory Structure

```
checkpoint-1-deliverables/
├── 01-empty-state-onboarding.png        # First-run empty state with click-to-fill prompt cards
├── 02-happy-path-flashcards.png          # Happy path: 5-item interactive flashcards (0 console errors)
├── 03-failure-rate-limit-429.png         # Failure State 1: HTTP 429 Rate Limit cooldown + retry button
├── 04-failure-mid-stream-disconnect.png  # Failure State 2: Mid-stream socket loss + contextual retry
├── checkpoint-1-resilience-demo.webp     # Complete browser recording of resilience flows
└── README.md                             # This deliverable index
```

*Note: All media files are also mirrored in `web/public/checkpoint-1-deliverables/` for direct access via browser or static preview host.*

---

## 2. Preview URLs

| Environment / Mode | URL | Description |
|---|---|---|
| **Primary Chat Flow (Happy Path)** | [`http://localhost:3000/chat`](http://localhost:3000/chat) | Interactive AI tutor, flashcards, study readiness scorecards, designed empty state |
| **Sabotage Test: HTTP 429 Rate Limit** | [`http://localhost:3000/chat?sabotage=429`](http://localhost:3000/chat?sabotage=429) | Injects rate-limit simulation to test cooldown banner & smart retry button |
| **Sabotage Test: Mid-Stream Disconnect** | [`http://localhost:3000/chat?sabotage=stream_abort`](http://localhost:3000/chat?sabotage=stream_abort) | Kills response stream mid-transmission to verify token retention and retry |
| **Sabotage Test: Server 500 Crash** | [`http://localhost:3000/chat?sabotage=500`](http://localhost:3000/chat?sabotage=500) | Injects fatal route error to test Next.js route boundary (`app/chat/error.tsx`) |

---

## 3. Screenshots & Visual Proof

### A. Designed Empty State (`01-empty-state-onboarding.png`)
- **Visual**: Welcoming onboarding hero with guidance and 4 categorized click-to-fill starter prompts (*Calculus II exam readiness, Computer Networking flashcards, Cellular Respiration quiz, TCP vs UDP breakdown*).
- **UX Guarantee**: Zero blank white screens; guides first-time users directly to core capabilities.

### B. Happy Path Primary Flow (`02-happy-path-flashcards.png`)
- **Visual**: Successful generation and rendering of a 5-item Computer Networking flashcard deck.
- **Micro-Interactions**: Ultra-fast 120ms flip animation with solid forest green contrast backing and horizontal slide deck transitions.
- **Console**: Verified 0 runtime or layout errors.

### C. Failure State 1: HTTP 429 Rate Limit Cooldown (`03-failure-rate-limit-429.png`)
- **Trigger**: Model overload or quota exhaustion (`?sabotage=429`).
- **UI Behavior**: Non-disruptive amber alert banner unwrapping server error details.
- **Recovery Micro-Interaction**: Contextual button: `Retry "Explain the OSI model layers"` — debounced, shows in-flight spinner, and disables during resubmission to prevent request hammering.

### D. Failure State 2: Mid-Stream Connection Drop (`04-failure-mid-stream-disconnect.png`)
- **Trigger**: Socket termination, airplane mode, or server connection reset mid-stream (`?sabotage=stream_abort`).
- **UI Behavior**: Preserves previously streamed assistant tokens; does not unmount or crash the chat canvas.
- **Recovery Micro-Interaction**: Amber recovery banner with `Retry "Summarize my study notes"` permitting instant recovery without re-typing.

---

## 4. Architectural Resilience Matrix

| Edge Case / Failure Scenario | Prevention / Recovery Layer | Implementation Location |
|---|---|---|
| **Root Application Crash** | Next.js Root Error Boundary | `web/src/app/error.tsx` |
| **Chat Route Exception** | Next.js Segment Error Boundary | `web/src/app/chat/error.tsx` |
| **Network / Stream Abort** | AI SDK `useChat` error state + contextual retry | `web/src/components/chat/ChatInterface.tsx` |
| **Layout Shift (CLS)** | Fixed-dimension skeleton placeholder | `web/src/components/chat/ChatSkeleton.tsx` |
| **Empty / Whitespace Input** | Input validation & submit button state guard | `web/src/components/chat/ChatInterface.tsx` |
| **Mobile Safari Viewport Jump** | `100dvh`, 16px inputs (no auto-zoom), safe-area insets | `web/src/components/chat/ChatInterface.tsx` |
