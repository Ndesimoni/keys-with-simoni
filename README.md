# Keys with Simoni CRM

Real estate CRM v1.2, built with React 18 and Vite. The application covers the 17 worksheets in the original workbook, including clients, properties, viewings, deals, commissions, and reports.

## Run locally

Use Node.js 20 or later (Node 22 recommended) and npm. Open this project folder in VS Code, then run:

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. See [Getting started](docs/getting-started.md) for the VS Code setup.

## Project structure

```text
src/
  app/                  Application shell, routed feature pages, and focused contexts
  components/
    layout/             Header, sidebar, page heading, and branding
    ui/                 Shared buttons, badges, icons, and display components
  config/               Navigation, field options, theme, and storage constants
  data/                 Original workbook schemas and fictional demo records
  features/
    clients/            Client desk and property matching
    dashboard/          Overview and KPIs
    guide/              In-app workflow guide
    insights/           CRM intelligence
    properties/         Property directory, media editor/gallery, and selectors
    records/            Shared tables/forms, validation, and record commands
    reports/            Date search and performance targets
  hooks/                Focused state access, actions, navigation, and persistence
  lib/                  Business rules, workspace selectors, media, and Excel
  services/
    files/              Backup validation and browser downloads
    storage/            Browser workspace and preference repositories
  styles/               Ordered foundation, workspace, responsive, theme, and media styles
  main.jsx              React entry point
public/                 Favicon and original downloadable workbook
tests/
  browser/              Playwright tests for the modern app
  fixtures/             Sample files used by tests
  smoke/                Offline edition smoke checks
  unit/                 Business, selector, and storage contract tests
scripts/                Offline build script
docs/                   Setup, architecture, product guide, and screenshots
legacy/offline/         Preserved independent offline prototype
```

The active application starts in [`src/app/App.jsx`](src/app/App.jsx). Read [Architecture](docs/architecture.md) before adding a feature.

The [Architecture audit](docs/architecture-audit.md) preserves the initial findings. [Frontend completion](docs/frontend-completion.md) records the implemented foundations and validation results. All 18 screens have reload-safe hash routes, such as `/#/properties`, with browser back/forward support. The Leads section at `/#/leads` shows contact details, lead sources, campaign references, and enquiry stages, with source totals and filters. Five source filters appear initially, including All sources; More opens a menu of the remaining choices. Selecting a source, clicking outside, pressing Escape, or using its close button dismisses the menu and keeps More available. The active source stays visible among the five filters. Leads share their existing client profile, so updates stay connected to follow-ups, deals, and the original 17-sheet Excel export.

## Commands

| Command                 | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `npm run dev`           | Start Vite with live reload                                 |
| `npm run build`         | Generate the modern application in `dist/`                  |
| `npm run preview`       | Serve the production build on port 4173                     |
| `npm test`              | Run unit/contract tests and offline smoke checks            |
| `npm run test:unit`     | Run business, selector, and storage contract tests          |
| `npm run test:e2e`      | Run browser tests with an isolated Vite server on port 5174 |
| `npm run format`        | Format active source, configuration, and documentation      |
| `npm run format:check`  | Check formatting                                            |
| `npm run offline`       | Serve the preserved offline edition on port 4173            |
| `npm run build:offline` | Rebuild the offline edition from its separate source        |

For browser tests, install Playwright's Chromium once:

```bash
npx playwright install chromium
npm run test:e2e
```

If Google Chrome is already installed, you can use it instead:

```bash
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

Formatting settings are shared through `.editorconfig` and `.prettierrc.json`. VS Code uses the recommended Prettier extension to format on save.

## Data and offline edition

Records and property attachments use this browser's local storage. Full JSON backups include photos and floor plans; Excel exports include record fields and reports. The existing storage keys and backup formats are retained.

The CRM starts in dark mode by default. Use the header theme switch to choose light mode; your selection is saved for future visits.

Unreadable saved records open a recovery screen that leaves the original data untouched. Download that data before explicitly replacing it. Failed saves show an export/retry banner; edits stay in memory until saving succeeds. Forms validate input and protect unsaved edits during drawer closing, navigation, and page exit.

The offline edition is documented in [`legacy/offline/README.md`](legacy/offline/README.md). Its independent assets stay outside Vite's production build.

See the [Product guide](docs/product-guide.md) for features and existing production limitations, and [Third-party notices](THIRD_PARTY_NOTICES.md) for bundled library notices.

# keys-with-simoni
