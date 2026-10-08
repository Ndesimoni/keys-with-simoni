<!-- # Development guidance

- The active application is React 18 + Vite under `src/`. Start with `README.md` and `docs/architecture.md`.
- Keep feature-specific pages in `src/features`, shared UI in `src/components/ui`, layout in `src/components/layout`, and non-React business logic in `src/lib`.
- Use the focused hooks in `hooks/useWorkspace.js` for records, actions, navigation, view state, and preferences. Define React components at module scope.
- Preserve browser storage keys, workbook field keys/column mappings, and JSON backup formats unless a requested change includes a migration.
- Root `public/` contains static assets for Vite. `legacy/offline/` is an independent archived implementation; only change it when the request concerns that edition.
- Historical Python scripts in `legacy/offline/tests` are reference material. Active tests are in root `tests/`.
- Use the existing Prettier and EditorConfig settings.
- Validate structural and business-logic changes with `npm test` and `npm run build`. Use `npm run test:e2e` for UI flows and component wiring.
- Browser tests start their own Vite server on port 5174. `PLAYWRIGHT_CHANNEL=chrome` selects an installed Google Chrome without downloading Chromium. -->

# Keys with Simoni — Real Estate CRM

## Project

Professional real estate CRM focused on the UAE market.

## Technology

- React 18 and Vite
- JavaScript and CSS
- Browser-local storage for current MVP
- Excel import/export
- JSON backup with property media

## Existing Features

- 18 CRM screens covering the original 17-sheet workbook
- Dashboard and analytics
- Client and lead management
- Properties for sale and rent
- Holiday homes and commercial listings
- Off-plan and secondary properties
- Property photos, floor plans and amenities
- Lead qualification and scoring
- Follow-ups and viewing management
- Deals, commissions and expenses
- Light and dark mode
- Responsive desktop/mobile interface

## Current Project Structure

- src/app/ — Application composition, React Router routes, and focused workspace contexts
- src/features/ — CRM pages and feature-specific components
- src/components/ — Shared UI and layout components
- src/hooks/ — Workspace access, data persistence, and preferences hooks
- src/services/storage/ — Validated browser storage repositories
- src/services/files/ — Backup validation and browser downloads
- src/lib/ — Business rules, selectors, media, and Excel utilities
- src/config/ — Navigation, fields, themes, and storage constants
- src/styles/index.css — Ordered stylesheet imports; maintain the cascade when editing the imported files
- src/data/schemas.js — Workbook data definitions
- src/data/demo.js — Demo records
- src/main.jsx — React entry point
- tests/ — Active unit, storage contract, browser, and offline smoke checks
- docs/architecture-audit.md — Architecture findings and staged refactoring plan

## Engineering Standards

Act as a senior software engineer and UI/UX designer.

- Preserve working features during refactoring.
- Prefer reusable components and custom hooks.
- Separate UI, business logic and data access.
- Use consistent typography and spacing.
- Maintain light and dark theme support.
- Design mobile-first, accessible interfaces.
- Validate forms and handle errors.
- Avoid unnecessary dependencies.
- Test changes before marking work complete.

## Roadmap

The frontend foundations are implemented; see `docs/frontend-completion.md`. Node 20 or later is required by the patched router dependency. The Rust/PostgreSQL backend remains the next phase.

1. Refactor monolithic React components.
2. Improve property-management workflows.
3. Improve client and lead management.
4. Introduce React Router and feature modules.
5. Build Rust Axum REST API.
6. Integrate PostgreSQL.
7. Add authentication and authorization.
8. Add secure cloud media storage.
9. Deploy production application.

## Important

This is currently a browser-local demo.
Do not treat it as a secure multi-user CRM.
Do not remove existing data features without approval.
