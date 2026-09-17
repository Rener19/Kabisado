# Kabisado Copilot - Web Chat & AI Tool System 🎓

Kabisado Copilot features a real-time conversational study companion powered by Google Gemini and Vercel AI SDK v7, with native server-side tool calling and a 4-state lifecycle state machine.

---

## 🛠 AI Tool Contracts & Specifications

The AI orchestrator in `src/app/api/chat/route.ts` registers two server-side tools defined in `src/lib/study-tools.ts`:

### 1. `evaluateStudyReadiness` (Exam Readiness & Knowledge Evaluator)
Evaluates a student's preparation for an academic subject across subtopics and calculates readiness metrics, mastery breakdowns, and prioritized study recommendations.

#### Parameter Schema (Zod)
```typescript
z.object({
  topic: z.string().describe('The primary academic topic or course subject (e.g. Organic Chemistry, Calculus II)'),
  subtopics: z.array(z.string()).min(2).max(5).describe('2 to 5 specific subtopics or modules to analyze'),
  targetExam: z.string().optional().describe('Target exam type (e.g. Midterm Exam, Finals, AP Exam)'),
  estimatedHoursStudied: z.number().optional().describe('Estimated total hours studied so far'),
  simulateError: z.boolean().optional().describe('Set to true to demonstrate the designed error state'),
})
```

#### Return Shape (`StudyReadinessResult`)
```typescript
interface StudyReadinessResult {
  topic: string;
  targetExam: string;
  readinessScore: number; // 0 - 100
  gradeTier: 'A+' | 'A' | 'B' | 'C' | 'Needs Work';
  status: 'Exam Ready' | 'Proficient' | 'Developing' | 'Critical Review';
  estimatedHoursStudied: number;
  subtopicBreakdown: Array<{
    name: string;
    mastery: number; // 0 - 100
    targetMastery: number; // 85%
    priority: 'High' | 'Medium' | 'Low';
    recommendedHours: number;
    status: 'Mastered' | 'Review Needed' | 'Priority Focus';
  }>;
  strengths: string[];
  weaknesses: string[];
  actionPlan: string[];
  evaluatedAt: string;
}
```

#### Rendered Component
- **Component**: `<StudyReadinessScorecard />`
- **Visual Features**:
  - Animated SVG circular readiness gauge with color-coded status badges (`Exam Ready`, `Developing`, etc.).
  - Responsive SVG Subtopic Mastery Bar Chart displaying current mastery vs. 85% target threshold.
  - Subtopic breakdown table with priority ratings and suggested study allocation hours.
  - Actionable study recommendations list.

---

### 2. `generateStudyDeck` (Interactive Concept Flashcards)
Generates high-yield study cards with practice questions, memory mnemonics, and self-testing challenges.

#### Parameter Schema (Zod)
```typescript
z.object({
  subject: z.string().describe('The academic domain or course name (e.g. Biochemistry, Data Structures)'),
  deckTitle: z.string().describe('A concise descriptive title for this flashcard deck'),
  conceptCards: z.array(
    z.object({
      term: z.string().describe('The key term, concept name, or core formula'),
      definition: z.string().describe('Crisp and accurate explanation in 1-2 sentences'),
      mnemonic: z.string().optional().describe('A memorable mnemonic hook or visual analogy'),
      practiceQuestion: z.string().describe('A quick test question challenging recall of this concept'),
      answer: z.string().describe('The direct answer to the practice question'),
      difficulty: z.enum(['easy', 'medium', 'hard']).describe('Relative concept difficulty level'),
    })
  ).min(2).max(4),
})
```

#### Return Shape (`StudyDeckResult`)
```typescript
interface StudyDeckResult {
  deckId: string;
  subject: string;
  deckTitle: string;
  totalCards: number;
  difficultySummary: { easy: number; medium: number; hard: number };
  estimatedReviewMinutes: number;
  cards: Array<{
    id: string;
    term: string;
    definition: string;
    mnemonic?: string;
    practiceQuestion: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  createdAt: string;
}
```

#### Rendered Component
- **Component**: `<InteractiveStudyDeck />`
- **Visual Features**:
  - 3D flippable card with smooth perspective rotation (Front: Term + Challenge Question; Back: Definition + Answer + Mnemonic).
  - Deck carousel controls (Prev / Next navigation and dot selectors).
  - Interactive "Mark as Kabisado" mastery toggle with real-time deck progress bar tracking.

---

## 🔄 Tool Part Lifecycle State Machine

Each tool invocation transitions through 4 distinct visual states managed by `<ToolPartRenderer />`:

| State | Lifecycle Stage | Visual Treatment |
| :--- | :--- | :--- |
| `1. input-streaming` | Tool call parameters streaming in from model | Purple glowing card with pulsing CPU icon and live streaming parameter key tags |
| `2. input-available` | Parameters complete; server action executing | Emerald pulsing border with spinner and structured parameter chip preview |
| `3. output-available` | Server execution successful | 200ms morph/crossfade into rich custom UI component (`<StudyReadinessScorecard />` or `<InteractiveStudyDeck />`) |
| `4. output-error` | Execution failure or test error trigger | Designed amber/rose error card with human-readable diagnostic details and session recovery action (never crashes UI) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000/chat](http://localhost:3000/chat) to interact with the AI Copilot and trigger the tool calling pipeline.

---

## 🔘 Stateful Button Motion System (`/buttons`)

A reusable, accessible button system that communicates its complete lifecycle through intentional motion (`idle` → `hover/focus` → `active` → `loading` → `success` / `error` → `idle`).

- **Interactive Sandbox Demo**: [http://localhost:3000/buttons](http://localhost:3000/buttons)
- **Component File**: [`src/components/ui/StatefulButton.tsx`](src/components/ui/StatefulButton.tsx)

### Motion Language & Timing Rationale

Every state transition uses purposeful durations mapped to human perception thresholds:
- **Hover Lift (150ms `ease-out`)**: Immediate acknowledgment of pointer presence without feeling jittery or nervous.
- **Active Press (100ms `scale(0.97)`)**: Immediate tactile response simulating a mechanical switch depress.
- **Label Transitions (160ms exit / 220ms enter `cubic-bezier(0.16, 1, 0.3, 1)`)**: Smooth vertical slide (`y: 12 → 0 → -12`) ensuring labels exit swiftly and new status resolves cleanly into focus.
- **Width Morphing (Spring `stiffness: 420, damping: 30`)**: Natural organic expansion and contraction to adapt to differing label lengths without layout thrash.
- **Success Hold (1800ms)**: Ample cognitive window for the user's visual cortex to register successful completion before gently easing back to idle.
- **Error Shake (400ms multi-keyframe `x: [0, -7, 7, -5, 5, -2, 2, 0]`)**: High-frequency dampening tremor communicating refusal. Automatically suppressed under `prefers-reduced-motion` while retaining rose alert coloring.
- **Compositor Performance**: Exclusively animates `transform` and `opacity` properties to prevent layout recalculations or Cumulative Layout Shift (CLS).

