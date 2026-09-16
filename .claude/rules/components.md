---
paths:
  - "src/**/*.jsx"
---

# Component Rules

## Styling

- Tailwind utility classes only. No inline `style={}` except for the `--accent` CSS variable and genuinely dynamic values (e.g. computed positions).
- Extract repeated class strings into a component, not a global CSS class.

## Resume template

- Two templates exist: `sidebar` (`Sidebar.jsx` + `MainColumn.jsx`) and `modern` (`ModernTemplate.jsx`), switched in `ResumeTemplate.jsx`. Both must render from the same `resume` data. Don't add a third without asking.
- The only global theme variable is `--accent` (default `#0F2A6E`). Per-text inline formatting is allowed and stored as sanitized HTML.
- Use `EditableText` for any resume text; never render user HTML without `sanitizeHtml`. Wrap editing-only UI (buttons, toolbar, sliders) in `.no-print`.
- Keep the sidebar (contact + skills, `Sidebar.jsx`) and main column (summary, Work History, Education, Accomplishments, References, `MainColumn.jsx`) structure fixed.
- Render `MainColumn` before `Sidebar` in DOM order (reordered visually with `order-first`) so the text extraction order stays ATS-friendly.
