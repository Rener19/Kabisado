# Test Suite & CI Deliverables — Build (Polish)

This folder contains all required submission deliverables for the **Build (polish)** testing checkpoint:
1. **Component Test Files** (Vitest + React Testing Library)
2. **End-to-End Test File** (Playwright with mocked AI stream)
3. **CI / CD Quality Gate Configuration** (GitHub Actions `.github/workflows/ci.yml`)
4. **Screenshots** showing the test suite and CI pipeline passing with 100% green status

---

## Folder Structure

```
test-submission/
├── README.md                      # This guide & submission summary
├── screenshots/
│   ├── ci-suite-passing.png       # Screenshot of passing CI dashboard (23/23 Vitest + Playwright + Typecheck)
│   └── playwright-e2e-passing.png # Playwright HTML report showing Desktop Chromium test passing
├── component-tests/
│   ├── ChatMessage.test.tsx       # Message renderer (text, markdown links, thinking indicator, tool results, streaming)
│   ├── ChatInputForm.test.tsx     # Validated form (empty state guard, whitespace rejection, click & Enter submit, stop button)
│   ├── ChatErrorBanner.test.tsx   # Error state (alert role, JSON parsing, retry action with snippet, dismiss action)
│   ├── InteractiveStudyDeck.test.tsx # Tool result (front challenge question, carousel navigation, 3D flip answer reveal, Kabisado mastery)
│   ├── StudyReadinessScorecard.test.tsx # Tool result (readiness score, grade tier, subtopic breakdown, action plans)
│   └── StatefulButton.test.tsx    # Motion state machine (idle, aria-busy loading, success, error, double-click protection)
├── e2e-tests/
│   └── primary-study-flow.spec.ts # Playwright E2E primary study flow with mocked SSE stream
└── config/
    ├── ci.yml                     # GitHub Actions CI workflow blocking pull requests on failures
    ├── vitest.config.ts           # Vitest configuration with JSDOM and path alias
    ├── playwright.config.ts       # Playwright E2E configuration
    └── setup.ts                   # Testing Library setup, matchMedia mock, and synchronous presence mock
```

---

## Deliverables Checklist & Evaluation Criteria

### 1. Meaningful Component Tests (Evaluation Criteria: At least 6 tests)
- **Total Tests Provided:** **23 tests across 6 files** (exceeds requirement).
- **Zero Test IDs / Zero CSS Class Queries:** Every assertion queries accessible role and label (`getByRole('button')`, `getByRole('textbox')`, `getByRole('link')`, `getByRole('alert')`). Renaming or restyling CSS classes will never break any test.

### 2. Chat Component Tested Across All 3 States
- **Pending State:** Pulsating thinking indicator tested in `ChatMessage.test.tsx` when an incoming assistant message has empty parts before first token arrival.
- **Streaming State:** Active token-by-token stream rendering tested in `ChatMessage.test.tsx` (`renders actively streaming partial text message chunks seamlessly`).
- **Error State:** Network failure, JSON error payload parsing, and smart retry micro-interactions tested in `ChatErrorBanner.test.tsx`.

### 3. One Validated Form Tested
- `ChatInputForm.test.tsx` tests empty state disabled button, whitespace-only rejection, Enter key submission, Shift+Enter multiline handling, and generation stop action.

### 4. One Tool-Result Component Tested
- `InteractiveStudyDeck.test.tsx` & `StudyReadinessScorecard.test.tsx` test interactive UI generation from structured tool outputs (`generateStudyDeck` and `evaluateStudyReadiness`).

### 5. Mocked AI Route (Never Calling Real API)
- In `primary-study-flow.spec.ts`, Playwright intercepts `**/api/chat*` via `page.route` to return Server-Sent Events (`data: {"type":"text-delta",...}`). Zero Gemini API tokens are consumed, guaranteeing 100% deterministic, offline-capable test runs.

### 6. Playwright E2E Test
- Walks the primary study conversation flow: loads `/chat` empty onboarding state, enters study prompt, asserts user bubble and AI streaming response, and navigates to the button motion lab.

### 7. CI Workflow Blocking Merges
- `config/ci.yml` runs on push and pull requests to `main`. It checks TypeScript compilation, runs all Vitest component tests, builds the Next.js app, and runs Playwright Chromium E2E. Failures block merges.

### 8. Agentic Self-Healing Demonstration
- When initial test runs encountered a jsdom exit animation stall with Framer Motion, the AI assistant diagnosed the root cause, updated `setup.ts`, and added event isolation (`stopPropagation`) to the card mastery toggle — autonomously restoring the suite to 100% green.

---

## How to Run the Tests Locally

```bash
cd web

# 1. Typecheck TypeScript
npx tsc --noEmit

# 2. Run Vitest Component Tests
npm test

# 3. Run Playwright End-to-End Tests
npm run test:e2e
```
