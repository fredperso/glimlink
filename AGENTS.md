# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains the product specification, `Glimlink_Specifications_Fonctionnelles_Detaillees_V3.pdf`. It describes Glimlink’s MVP/V1 recruitment platform; “V3” refers to the document revision, not the software version.

The repository now contains a React / HTML / TypeScript prototype. `src/components/` holds screens and reusable UI; `src/domain/` holds the model, fictional fixtures and deterministic rules; `tests/` covers business and browser journeys; `scripts/` packages the standalone preview; `docs/` records design, coverage and validation; `tools/skills/` contains retrieved design skills. Treat the specification as the product reference; section 20 records unresolved decisions. `maquette.html` is generated and should not be edited manually.

## Build, Test, and Development Commands

Node.js 24 and npm are required. Commands run from the repository root:

```sh
rtk npm ci
rtk npm run dev
rtk npm run build
rtk npm test
rtk npm run test:e2e
```

The build checks TypeScript, generates `dist/` and regenerates the standalone `maquette.html`. Browser tests require Playwright Chromium. The current sandbox blocks local sockets and CLI browser startup; browser MCP validates the same journeys with mocked HTTP responses. Do not report the CLI suite as passing when only MCP journeys ran.

To inspect the specification with Poppler installed:

```sh
rtk pdftotext -layout Glimlink_Specifications_Fonctionnelles_Detaillees_V3.pdf /tmp/glimlink-spec.txt
rtk less /tmp/glimlink-spec.txt
```

## Coding Style & Naming Conventions

Use strict TypeScript, React functional components, 2-space indentation and single quotes; formatting settings are in `.prettierrc.json`. Prefer native semantic controls, accessible labels, visible focus, touch targets and reduced motion. User-facing copy is French. Use descriptive domain names for students, partner companies, advisers, training programs, calendars, and recruitment needs. Keep Markdown instructions concise and commands runnable from the repository root.

## Testing Guidelines

Node's test runner covers Appendix B acceptance scenarios (`V3-01` through `V3-12`) in `tests/domain.test.ts`; Playwright covers desktop/mobile journeys in `tests/e2e/`. Keep scenario identifiers in descriptions. No coverage percentage target is configured.

Cover adviser validation before publication, preservation of corrected student data, inherited calendars, unknown availability, withdrawn profiles, confidential fields, and isolation between authorized talent pools. Keep draft data separate from the published snapshot. All prototype data is fictional; scores, CV extraction, authentication and email are simulations. Browser filtering illustrates scope and is not a production security boundary. Identify section 20 assumptions in `docs/SPEC_COVERAGE.md`.

## Commit & Pull Request Guidelines

Git history is unavailable in this checkout, so no existing commit convention can be verified. Use concise, imperative commit subjects, such as `Document calendar acceptance criteria`.

Pull requests should explain the change, reference relevant specification sections or issues, and state validation performed. Include screenshots for interface changes. Identify assumptions involving section 20 rather than presenting unresolved business rules as approved requirements.

## Agent Instructions

Read `/home/fjeanne/.codex/RTK.md` and prefix shell commands with `rtk`, as required by the workspace instructions.
