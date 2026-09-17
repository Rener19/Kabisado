# Kabisado Copilot 🎓

Kabisado Copilot is a mobile-first, AI-powered learning engine that transforms uploaded educational PDFs into an interactive learning experience. This project is a 4th-year computer science internship capstone, built over an 8-week sprint with a strong focus on high engineering rigor, streaming UI, state management, complex gesture handling, and robust AI data pipelines.

## 🚀 Features

- **RAG Chat Engine**: A conversational interface to query your documents. Features real-time streaming responses and exact page-number citations to trace AI answers back to the source text.
- **Server-Side AI Tools & Lifecycle UI**: Native tool execution (`evaluateStudyReadiness` & `generateStudyDeck`) with a 4-state lifecycle state machine (`input-streaming`, `input-available`, `output-available`, `output-error`), rendering SVG mastery charts, readiness scorecards, and interactive 3D flashcard decks.
- **Spaced-Repetition Flashcards**: AI-generated flashcards (strict JSON parsing) presented in a swipeable, Tinder-style deck. It utilizes a spaced-repetition algorithm (like SM-2) to schedule reviews based on your swipe direction (Remembered vs. Forgotten).
- **Dynamic Quiz Engine**: AI-generated assessments including Multiple Choice and Fill-in-the-Blanks. Features dynamic UI component mounting, real-time grading, and knowledge gap summaries.

## 🛠 Tech Stack

Built entirely on $0-deployment-cost free-tier services.

### Frontend (Mobile & Web)
- **Framework**: React Native with Expo
- **Libraries**: `react-native-reanimated`, `react-native-gesture-handler`, `axios`, Expo Router
- **Design**: Mobile-first cross-platform UI

### Backend (API & AI Pipeline)
- **Framework**: Python with FastAPI (Deployed on Render)
- **Data Parsing**: `PyPDF2` / `pdfplumber`
- **Validation**: Strict schema validation with Pydantic
- **AI Orchestration**: Google Gen AI SDK (Gemini 1.5 Pro/Flash)

### Database & Auth
- **Platform**: Supabase (Free Tier)
- **Database**: PostgreSQL with `pgvector` for embedding storage and similarity search
- **Services**: Supabase Auth, Supabase Storage (for PDFs)

## 🏗 Architecture & Flow

1. **Document Ingestion**: PDF Upload -> FastAPI Extraction -> Text Chunking (with page tracking) -> Gemini Embeddings -> Supabase `pgvector`.
2. **Chat**: User Query -> Vector Similarity Search -> Gemini Context Injection -> Streamed Response (SSE).
3. **Flashcards & Quizzes**: Prompt Gemini -> Pydantic Schema Validation -> Supabase Storage -> React Native Dynamic Rendering.

## 💻 Local Setup (Coming Soon)

Instructions for setting up the local development environment for both the FastAPI backend and Expo frontend will be added as the project progresses.

---

## 🔘 Deliverable: Stateful Action Button Motion System

A reusable, compositor-friendly button motion system built with Framer Motion that communicates its complete lifecycle through intentional physics transitions (`idle` → `hover/focus` → `active` → `loading` → `success` / `error` → `idle`).

- **Live Sandbox URL**: [http://localhost:3000/buttons](http://localhost:3000/buttons)
- **Component File**: [`web/src/components/ui/StatefulButton.tsx`](web/src/components/ui/StatefulButton.tsx)
- **Interactive Sandbox Page**: [`web/src/app/buttons/page.tsx`](web/src/app/buttons/page.tsx)

### Motion Language & Timing Rationale

Every state transition uses purposeful durations mapped to human perception thresholds:
- **Hover Lift (150ms `ease-out`)**: Rapid acknowledgment of pointer presence without feeling jittery or nervous.
- **Active Press (100ms `scale(0.97)`)**: Immediate tactile response simulating a mechanical switch depression.
- **Label Transitions (160ms exit / 220ms enter `cubic-bezier(0.16, 1, 0.3, 1)`)**: Smooth vertical slide (`y: 12 → 0 → -12`) ensuring labels exit swiftly and new status resolves cleanly into focus.
- **Width Morphing (Spring `stiffness: 420, damping: 30`)**: Natural organic expansion and contraction to adapt to differing label lengths without layout thrash.
- **Success Hold (1800ms)**: Ample cognitive window for the user's visual cortex to register successful completion before gently easing back to idle.
- **Error Shake (400ms multi-keyframe `x: [0, -7, 7, -5, 5, -2, 2, 0]`)**: High-frequency dampening tremor communicating refusal. Automatically suppressed under `prefers-reduced-motion` while retaining rose alert coloring.
- **Compositor Performance**: Exclusively animates `transform` and `opacity` properties to prevent layout recalculations or Cumulative Layout Shift (CLS).

### System Coherence (Two Coherent Buttons)
To demonstrate that this is a systematic design language rather than a one-off decorative button, the sandbox showcases two distinct actions sharing the exact same motion tokens:
1. **Hero AI Action ("Generate Study Set")**: Emerald gradient with `Sparkles` icon for generating flashcard decks and study notes.
2. **Secondary Cloud Action ("Save to Library")**: Neutral card styling with `Bookmark` icon for saving items to the student's study library.

---
*Developed for a computer science capstone project. Designed to prove high engineering rigor and scalable AI integrations.*

