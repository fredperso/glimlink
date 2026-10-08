# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains the product specification, `Glimlink_Specifications_Fonctionnelles_Detaillees_V3.pdf`. It describes Glimlink’s MVP/V1 recruitment platform; “V3” refers to the document revision, not the software version.

The repository now contains a React / HTML / TypeScript prototype. `src/components/` holds screens and reusable UI; `src/domain/` holds the model, fictional fixtures and deterministic rules; `tests/` covers business and browser journeys; `scripts/` packages the standalone preview; `docs/` records design, coverage and validation; `specificaiton/` contains the maintained Markdown functional specifications; `tools/skills/` contains retrieved design skills. Treat the PDF V3 and `specificaiton/README.md` as the product references. The Markdown specifications consolidate the PDF and later explicit user decisions; `specificaiton/spec-process-arbitrages.md` preserves unresolved decisions from section 20. `maquette.html` is generated and should not be edited manually.

## Build, Test, and Development Commands

Node.js 24 and npm are required. Python 3 is required for the documentation check (`spec:check`). Commands run from the repository root:

```sh
rtk npm ci
rtk npm run dev
rtk npm run build
rtk npm test
rtk npm run test:e2e
rtk npm run spec:check
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

## Mandatory Specification Maintenance — Every User Request

For **every new user request**, read `specificaiton/README.md` and check its impact on the functional specifications before declaring the request complete. This is an explicit user requirement.

- If the request changes behavior, business rules, roles, data, states, navigation or presentation, update the affected Markdown specifications and acceptance criteria in the same delivery as the implementation. Preserve stable requirement IDs; update dates and the application revision examined when appropriate.
- Record every request in `specificaiton/JOURNAL.md`: request, impact, decisions/open questions, affected files/requirements and validation actually performed. For a status question or operation with no product impact, record **Aucun changement fonctionnel** and its reason; do not invent functional changes.
- Keep `specificaiton/TRACEABILITE.md` and the index consistent when coverage, structure or decisions change. Distinguish PDF requirements, explicit user decisions, implementation observations, simulations and unresolved assumptions. Never silently turn a prototype choice into an approved business rule.
- Use the retrieved skills `tools/skills/create-specification/SKILL.md` and `tools/skills/update-specification/SKILL.md` for specification creation/maintenance. The user-requested `specificaiton/` path overrides their default `/spec/` path. The exact skill name `specifications` was unavailable when this structure was created.
- Keep the PDF and `specificaiton/SOURCE_V3.md` as reference archives; put later decisions in the maintained thematic files.
- Run `rtk npm run spec:check` after documentation updates. This checks document structure, links and coverage; it does not replace reviewing semantic consistency with the request and code.
- In the final report, briefly mention which specifications were updated when the request changes the product. Do not report unexecuted application tests as passing.

Full process: `specificaiton/spec-process-gouvernance.md`.
