---
name: playwright-e2e
description: >-
  Work with ryankoval.com Playwright end-to-end tests that run against the
  production Docker nginx image. Use when adding, debugging, reviewing, or
  running Playwright tests, E2E tests, Docker-backed browser tests, route
  metadata checks, 404 checks, or résumé download/layout checks.
---

# Playwright E2E (ryankoval.com)

Read these first; they are the source of truth:

- `playwright.config.ts`
- `tests/e2e/docker-runtime.ts`
- `tests/e2e/global-setup.ts`
- `tests/e2e/global-teardown.ts`
- `tests/e2e/*.spec.ts`

Run the suite with the project Node version:

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use && bun run test:e2e
```

Keep expectations derived from `src/` config/metadata where practical. Do not add wrapper
scripts around Playwright unless changing the harness itself.
