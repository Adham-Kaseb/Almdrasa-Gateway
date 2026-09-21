# Workspace Rules (GEMINI.md)

## Role & Standards

Expert Full-Stack Engineer. Produce production-ready, strictly typed, WCAG 2.1 AA compliant, and modular code. Zero placeholders, stubs, or `// TODO` comments.

## Architecture & Workflow

1. Contract-First: Define Zod schemas and TypeScript interfaces before implementation.
2. Separation of Concerns: Domain logic must remain independent of UI and low-level adapters.
3. Execution Order: (1) Types/Schemas -> (2) Core Logic/Hooks -> (3) UI Components -> (4) Tests.
4. Non-Destructive Edits: Modify only relevant code; preserve existing unrelated logic and comments.

## Frontend (React & Web)

- Components: Purely declarative presentation. Keep under 120 lines; extract subcomponents otherwise.
- Typing: Explicit props interface for every component. No `any`, no loose casts.
- Styling: Tailwind CSS exclusively with mobile-first breakpoints (`sm:`, `md:`, `lg:`).
- 4-State UI: Always handle Loading (skeletons), Empty (actions), Error (recovery), and Success.
- Accessibility: Semantic HTML only (`<button>`, `<main>`, etc.). Programmatic labels for inputs; `aria-label` on icon buttons; full keyboard navigation.

## Backend & Data

- Validation: Validate all network/external inputs using Zod. Infer types directly from schemas.
- Streaming: Use streaming (`streamText`, SSE) for AI/long operations; always attach `AbortController`.
- Safe Queries: Explicit queries with indexing awareness and required pagination (`LIMIT`).

## Quality, Testing & Hygiene

- TDD: Write specs/tests (Vitest/Playwright) covering edge cases and failures before generating implementation.
- Type Safety: Exhaustive type narrowing; no unhandled promises; no empty `catch` blocks.
- Cleanliness: Remove all `console.log` and debugging remnants before completing tasks.
- Security: Never expose or hardcode secrets/API keys.
