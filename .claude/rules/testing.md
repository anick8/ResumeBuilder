---
paths:
  - "**/*.test.{js,jsx}"
  - "**/*.spec.{js,jsx}"
  - "**/__tests__/**"
  - "test/**"
  - "vitest.config.*"
---

# Testing Rules

## Stack

- **Vite / React:** Vitest + React Testing Library + `jsdom`.
- JavaScript only — test files are `.test.js` / `.test.jsx`, no TypeScript.

## Running

- Full suite: `npm test`. One-shot (no watch): `npx vitest run`.
- Single file: `npx vitest run <path>`.
- Run the relevant tests after every change; run the full suite before declaring a task done.

## File Layout

- Co-locate tests next to the code: `Button.jsx` → `Button.test.jsx`.
- Use `__tests__/` only when a folder has many related tests.
- Shared fixtures and mocks go in `test/fixtures/` and `test/mocks/`.

## Writing Tests

- Test behavior, not implementation: assert on what the user sees or what the function returns.
- Query by role, label, or visible text (`getByRole`, `getByText`, `getByLabelText`); `testID` only as a last resort.
- Use `userEvent` to simulate interaction; `await findBy*` for async UI.
- One behavior per `it(...)`. Name tests as sentences: `it('shows an error when email is invalid')`.
- Arrange / Act / Assert — keep each test readable top to bottom.
- Cover the edge cases that matter here: empty/null inputs, validation failures, loading and error states.
- No snapshot tests for UI unless explicitly asked — they break on every style change and catch little.

## Mocking

- Mock at the boundary: the API client (`src/services/api.js`), `fetch`, and timers.
- Never mock the unit under test or its internal helpers.
- Use `vi.useFakeTimers()` for countdowns/debounces and always restore real timers after.

## State

- Reset Context state between tests — no state leaking across tests.
- Each test sets up its own data; never depend on test execution order.

## Don't

- Don't delete, skip (`.skip`), or loosen a failing test to make the suite green — fix the code or ask.
- Don't commit `.only`.
- Don't leave `console.log` in tests.
- Don't hit real external services or third-party APIs from tests.
