# Agent Instructions for Kabisado Copilot

- Always adhere to the tech stack defined in `RULES.md` (React Native/Expo, FastAPI, Supabase, Gemini 1.5 Pro/Flash).
- Maximize cost-efficiency: restrict architectures to free-tier constraints (Render free tier, Supabase free tier).
- Provide clean, robust, streaming-ready code and focus on high engineering rigor.
- When generating schemas, strictly use Pydantic for the Python backend.
- Maintain accurate `page_number` tracking for chunking and prompt generation.
- Consult `RULES.md` for architecture and database schema rules.
- **Expo Router SEO**: Use `import Head from 'expo-router/head'` (default export) and ensure `"web": { "output": "static" }` is configured in `app.json` for proper SEO/SMO metadata generation.
- **React Native Web Responsiveness**: Always leverage `Platform.OS === 'web'` to conditionally scale typography (e.g., larger headers for desktop) and adapt flex layouts (`row` vs `column`) for mobile edge cases.
- **TypeScript / JSX Imports**: Explicitly include `import React from 'react'` in all `.tsx` components to prevent ESLint/TS compilation errors (`error TS2305` or JSX missing errors), depending on the Expo babel configuration.
- **Production Readiness Data (Ship Requirement)**: The current `evaluateStudyReadiness` tool in `web/src/lib/study-tools.ts` uses simulated heuristic mastery scores. Upon project shipping/production integration, replace the simulated heuristic with dynamic queries against actual user quiz scores and spaced repetition/SM-2 review history from Supabase.
