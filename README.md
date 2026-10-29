# ResumeBuilder

Paste a job description, get a resume tailored to it, export an ATS-friendly PDF — all in the browser, no backend.

<!-- TODO: screenshot or GIF of editor + tailoring -->
<!-- TODO: live demo link (Vercel) -->

## Why
Most resume builders produce pretty PDFs that ATS parsers can't read, and none of them help you match a specific job. This one keeps a single-column reading order with real selectable text, and highlights/reorders your content against the JD's keywords.

## Features
- **JD tailoring** — extracts keywords from the job description and surfaces matching experience (`src/lib/tailor.js`)
- **Inline editing** — click any text to edit; add, remove and reorder items
- **ATS-friendly PDF export** — standard headings, selectable text (`src/lib/exportPdf.js`)
- **Accent color + template picker**
- **Sanitized HTML** for rich text fields

## Stack
React 19 · Vite · Tailwind CSS v4 · Context API · Vitest + React Testing Library

## Run locally
```bash
npm install
npm run dev     # http://localhost:5173
npm test        # unit + component tests
npm run build
```
