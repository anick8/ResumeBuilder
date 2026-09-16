# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**ResumeBuilder** — a browser-based resume builder that tailors content to a job description and exports ATS-friendly PDFs.

**Primary goals (in priority order):**

1. Tailor resume content to a specific job description.
2. Export an ATS-friendly PDF (single-column reading order, real selectable text, standard section headings).
3. Use one fixed template where only the accent color can change.

## Tech Stack

- **Language:** JavaScript (not TypeScript)
- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS
- **State:** Context API
- **Backend:** none
- **Database:** none
- **Testing:** Vitest + React Testing Library + jsdom
- **Deployment:** Vercel
- **Package manager:** npm

## Repository Layout

```
/
├── src/
│   ├── components/ # reusable UI components
│   ├── pages/       # route-level screens
│   ├── services/    # API client — all network calls go through here
│   ├── lib/         # helpers (e.g. PDF export, tailoring logic)
│   ├── hooks/        # custom hooks
│   ├── data/          # resume.js (seeded content) and static constants
│   └── test/           # test setup
├── public/
└── CLAUDE.md
```

## Commands

```bash
npm install
npm run dev          # Vite dev server, http://localhost:5173
npm run build         # production build — MUST pass before deploy
npm run lint           # oxlint
npm test                # vitest
npx vitest run <path>  # single test file
```

Before considering any task done: run `lint`, `test`, and `build`. All must pass.

## Resume Template

There are **two** resume templates, selected via `design.template` (`TemplatePicker`) and switched in `src/components/ResumeTemplate.jsx`:

**`modern`** (`ModernTemplate.jsx`, from AnikethResume_May_2026_Fixed.pdf): full-width header (uppercase name in accent, title, icon contact row incl. LinkedIn) over a 1.55fr/1fr grid — Summary + Work Experience (company description line, calendar/pin meta) on the left; Education, Languages (1–5 dots), Skills as chips (`resume.tags`), Key Achievements, References on the right. Inter font.

**`sidebar`** (default), modeled on a two-column A4 layout:

- **Sidebar** (full-height, navy `#0F2A6E` by default): name, title, Contact block (Address / Phone / E-mail / WWW), and a Skills list with white proficiency bars.
- **Main column**: summary first, then Work History, Education, Accomplishments, and References, each under an accent-colored heading with a thin rule. Entries have a left date column, bold role, italic company, and bullets with bolded keywords.
- **Font:** a geometric sans (e.g. Questrial, Century Gothic, or a close web-safe fallback).
- **Theming:** the only global theme variable is `--accent`, which drives the sidebar background and section headings. Default is `#0F2A6E`. Inline text formatting (bold/italic/underline, font family, size, color on selected text) is allowed per field via the floating `FormatToolbar`.
- **DOM order:** the main column (`MainColumn`) renders before the sidebar (`Sidebar`) in markup; the sidebar is repositioned visually to the left with `order-first`, so extracted/ATS text reading order stays sane.
- **Editing:** every text field is an `EditableText` (contentEditable). Lists (jobs, bullets, education, accomplishments, references, skills) get add/remove/move via `ListControls`. Sections can be hidden from `SectionsPanel`.

**Rules:**

- Both templates read the same `resume` data; template-specific fields (`tags`, `languages`, per-job `location`/`description`, `contact.linkedin`) are simply ignored by the other. `migrate()` in `useResume.jsx` backfills new fields into older saved state — extend it when adding fields.
- Don't add a third template without asking.
- Do not introduce new global theme variables beyond `--accent`.
- Editing controls and the toolbar must carry `.no-print` so they never appear in the PDF.

## Conventions

**React**

- Functional components with hooks only — no class components.
- One component per file; named exports for components.
- Document component props with JSDoc `@param` so intent is clear without type checking.
- Co-locate component-specific helpers; promote to `lib/` only when reused.

**Styling**

- Tailwind utility classes. No inline `style={}` except for the `--accent` CSS variable and genuinely dynamic values.
- Extract repeated class strings into a component, not a global CSS class.

**JavaScript**

- ES modules only (`import`/`export`) — no `require`. `const`/`let`, never `var`.
- 2-space indentation.
- No compiler safety net: guard against undefined/null before access; keep functions small and predictable.
- JSDoc on non-trivial functions to document inputs/outputs.

**Data / Tailoring**

- Seed content lives in `src/data/resume.js` (bullets may use `**bold**`); never hardcode it into JSX.
- Live state is `ResumeProvider` / `useResume()` in `src/hooks/useResume.jsx` (reducer + `localStorage['resumebuilder:v1']`). Text fields are **sanitized HTML strings** — always pass user HTML through `sanitizeHtml` (`src/lib/html.js`, inline tags + `font-family|font-size|color` styles only) and use `stripHtml` when you need plain text.
- JD-tailoring is done client-side in `src/lib/tailor.js` (keyword overlap, reorders skills/bullets) — no backend or external API calls. If a real API is ever added, route it through `src/services/api.js`.

**PDF / ATS export**

- Export uses the browser's native print dialog (`src/lib/exportPdf.js` + `@media print` in `src/index.css`) — never a canvas-rasterizing library. This keeps the PDF's text real and selectable.
- Keep standard section headings (Work History, Education, etc.) so ATS parsers recognize them.

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`, `docs:`, `test:`.
- Small, focused commits — one logical change each.
- Never commit `.env`, `node_modules`, build output, or `.claude/settings.local.json`.

## Do / Don't

**Do**

- Ask before adding a new dependency.
- Match the existing pattern in neighboring files before introducing a new one.
- Run lint + test + build before declaring work complete.

**Don't**

- Don't add TypeScript — this is a JavaScript project by choice.
- Don't introduce a new styling system or state library without asking.
- Don't add a second resume template or a template switcher.
- Don't run production builds or deploys without asking.
- Don't leave `console.log` or commented-out code in committed files.
