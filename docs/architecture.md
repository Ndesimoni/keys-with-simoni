# Project architecture

The modern React application is the source of truth for development. It uses feature folders, shared components, and a workspace provider. The original offline prototype is preserved separately.

## Application flow

```text
index.html
  → src/main.jsx
  → src/app/App.jsx
  → WorkspaceProvider
      → layout components
      → selected feature page
      → record details and editor
```

`App.jsx` mounts a React Router hash data router. `FeatureRoutes.jsx` lazy-loads the 18 screens. Hash paths survive refresh and browser back/forward navigation on static hosting without server rewrites. A query passed from global search is retained in the Client desk URL. Feature and root error boundaries provide retry/reload without clearing records.

`features/leads/LeadsPage.jsx` provides a dedicated acquisition view over existing `Clients` records. It shows source totals, campaign references, contact details, and lead stages, with combined source/stage/search filters. Pure selectors retain custom imported values and unrecorded sources. The shared table accepts an explicit column list for this view; the shared client editor retains its section-by-section form and displays lead labels from the current route. No separate lead collection or conversion copy is created: browser storage, linked records, JSON backups, and the 17-sheet workbook retain their existing contracts.

`WorkspaceProvider.jsx` composes five focused contexts. Consumers use only the hooks they need from `hooks/useWorkspace.js`:

| Hook                    | Responsibility                                                  |
| ----------------------- | --------------------------------------------------------------- |
| `useRecords()`          | Record envelope, records, summaries, persistence failures/retry |
| `useWorkspaceActions()` | CRUD, editors/details, backups and Excel file workflows         |
| `useNavigation()`       | Current section, URL navigation                                 |
| `useWorkspaceView()`    | Search, filters, pagination, reports, open drawers/menu/toast   |
| `usePreferences()`      | Theme, targets, preference persistence                          |

Context values are memoized. `useRecordActions()` depends on record data and stable state setters, so typing a search or toggling a menu does not recreate the record/action contexts. View state is still grouped; feature-owned local state can be added when a screen needs independent filters.

`useWorkspaceData()` owns the saved envelope and persistence/recovery states. `useWorkspacePreferences()` owns settings and theme synchronization. Both use storage repositories. Feature selectors are pure JavaScript modules next to their pages. Record commands and validation live in `features/records`; the shared editor composes `RecordField` and `PropertyMediaEditor`.

`Drawer` uses a native modal dialog with a labelled title, inert background, explicit Tab wrapping, Escape, scroll locking, and focus restoration. Record viewers and editors use its default centered placement: an 840px desktop overlay with an internally scrolling body, fixed header/footer, and a full-screen layout at widths up to 750px. Property records select its wide size (1040px), and their title receives initial focus so the gallery remains visible when opening. Mobile navigation explicitly uses side placement. The editor guards unsaved work during closing, in-app/browser history navigation, and document exit.

`features/records/formSections.js` assigns every editable workbook field to a logical section. Clients, Properties, Deals, Interaction log, and Client care use sequential sections followed by review; shorter modules remain one-page forms. `useRecordFormSteps()` manages navigation, section validation, complete-record validation, and focus/scroll restoration after a step change. The parent editor keeps the complete draft and property media, including fields in unmounted sections. `FormStepper` provides labelled progress/navigation; `RecordReview` summarizes entered fields and media with Edit section controls. Existing records allow direct section access, and property gallery actions open the presentation section. New records unlock steps in sequence, and only the final review submits a multi-section record.

## Responsibilities

| Folder                   | Put here                                                            |
| ------------------------ | ------------------------------------------------------------------- |
| `src/app`                | App composition, workspace orchestration, and actions               |
| `src/features/<feature>` | Pages and components specific to that feature                       |
| `src/components/ui`      | Reusable visual controls without workspace state                    |
| `src/components/layout`  | Persistent navigation, branding, and page chrome                    |
| `src/hooks`              | Workspace access, React state/effects, and persistence hooks        |
| `src/services/storage`   | Browser workspace and preference reads/writes                       |
| `src/services/files`     | JSON backup validation and browser downloads                        |
| `src/config`             | Navigation definitions, field options, theme, and storage constants |
| `src/data`               | Workbook schemas and fictional seed records                         |
| `src/lib`                | Non-React helpers and business rules                                |
| `src/styles`             | Global design system, responsive layout, and theme styles           |
| `public`                 | Assets served unchanged by Vite                                     |
| `tests`                  | Active unit, smoke, and browser regression tests                    |
| `docs`                   | Developer setup, product documentation, and screenshots             |

The ten data-entry screens other than Properties share `RecordsPage` and `RecordTable`. `ContactsPage` supplies contact-specific tabs and a pure matching selector to the shared page; it filters the existing Contact type field without changing workbook columns. Properties has its own `PropertyDirectory`, while the record detail and editor components support every data-entry module.

## Utility modules

| Module              | Responsibility                                                              |
| ------------------- | --------------------------------------------------------------------------- |
| `lib/records.js`    | Record-field lookup, labels, statuses, and numeric aggregation              |
| `lib/schema.js`     | Field metadata, blank workspaces, and unique record IDs                     |
| `lib/crm.js`        | Lead qualification, commissions, receipts, reminders, and calculated fields |
| `lib/properties.js` | Listing purpose, pricing, classification, and amenities                     |
| `lib/media.js`      | Photo/floor-plan access, validation, and image compression                  |
| `lib/excel.js`      | Workbook import and 17-sheet Excel export                                   |
| `lib/dates.js`      | Date arithmetic and display                                                 |
| `lib/format.js`     | Currency and number display                                                 |
| `lib/workspace.js`  | Workspace summaries and record search/filter/sort selection                 |

Workbook field keys, sheet names, and column letters remain compatible with the original files. Browser records use `kws-crm-v1`; preferences use `kws-crm-preferences`. Full backups retain the `keys-with-simoni-full-backup` format.

## Storage boundary

The record repository exposes `read()` returning `{ workspace, error, raw }`, `load()` returning a validated workspace or throwing, and `save()`. A missing key starts fictional demo records. Unreadable JSON, invalid envelope/record shapes, duplicate IDs, or blocked access open the recovery screen; autosaving is suspended until the user retries successfully or explicitly chooses an empty workspace. Unknown metadata and record fields are retained, and missing module arrays are filled with empty lists.

Failed writes keep the in-memory record state, expose a persistent export/retry banner, and warn on document exit. Preferences fall back to valid settings/targets and report write failure separately. Repositories resolve storage lazily and accept an injectable getter for tests. Existing keys remain `kws-crm-v1` and `kws-crm-preferences`.

JSON restoration validates the backup format/version, records, media, and size before confirmation or replacement. Excel import reads namespace-prefixed or default-namespace OOXML, rich/shared strings, numeric zero, and dates. Missing workbook parts and unmatched sheets fail before replacement. Excel and JSZip are loaded on demand; Excel exports omit attachments while JSON backups retain them.

The repositories remain synchronous and browser-local. HTTP integration will need asynchronous loading/error states and server-side validation. No cross-device or cross-tab synchronization is implemented.

## Styles

`styles/index.css` imports foundation, workspace, responsive, property collection, theme, property responsive, and listing/media styles in the original cascade order. `frontend.css` adds dialog/recovery/validation/focus and reduced-motion rules. Preserve import order; source-order-sensitive original overrides are intentionally retained.

## Adding or changing a feature

1. Find its page in `src/features`, or add a new feature folder for a distinct screen.
2. Put reusable controls in `components/ui` and non-React logic in `lib`.
3. Update `config/navigation.js` and `app/FeatureRoutes.jsx` when adding navigation.
4. Keep schema changes compatible with existing record keys and workbook columns.
5. Run `npm run format`, `npm test`, and `npm run build`. Run `npm run test:e2e` when changing user flows or component wiring.

## Legacy boundary

`legacy/offline/src/App.jsx` and `legacy/offline/public` belong to the independent, zero-install prototype. Its bundled older runtime uses a hooks adapter. The modern app uses standard React 18 hooks directly.

`npm run build:offline` only rebuilds the legacy app. Vite only copies the root `public/` assets into `dist/`, so the offline HTML and libraries cannot overwrite the modern build.

Historical Python browser scripts live under `legacy/offline/tests` for reference. Active browser checks live under `tests/browser` and resolve their assets relative to the project.
