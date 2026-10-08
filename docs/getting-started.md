# Getting started in VS Code

The active application is a React 18 + Vite project. It includes all 17 workbook screens, light/dark mode, property media, Excel interoperability, and browser-local records.

## Start the app

1. Open **VS Code → File → Open Folder** and select `Keys_with_Simoni_VSCode_Starter`.
2. Open **Terminal → New Terminal**.
3. Check `node -v` and `npm -v`. Use Node.js 20 or later (Node 22 recommended).
4. Run `npm install`.
5. Run `npm run dev`.
6. Open <http://localhost:5173>.

Save source changes to see Vite update the browser. For Chrome debugging, choose **Run and Debug → Run CRM in Chrome**. Build and test tasks are available under **Terminal → Run Task**.

## Where to work

| Change                                      | Location                                               |
| ------------------------------------------- | ------------------------------------------------------ |
| Application composition                     | `src/app/App.jsx`                                      |
| Workspace orchestration                     | `src/app/WorkspaceProvider.jsx`                        |
| Record actions and file handlers            | `src/hooks/useRecordActions.js`                        |
| Routes and feature loading                  | `src/app/FeatureRoutes.jsx` and `src/config/routes.js` |
| Record and preference persistence hooks     | `src/hooks/`                                           |
| Browser storage reads and writes            | `src/services/storage/`                                |
| A specific screen                           | Its folder under `src/features/`                       |
| Header or sidebar                           | `src/components/layout/`                               |
| Shared visual control                       | `src/components/ui/`                                   |
| Field options or navigation                 | `src/config/`                                          |
| Workbook field mapping                      | `src/data/schemas.js`                                  |
| Fictional demo records                      | `src/data/demo.js`                                     |
| Business calculations or file import/export | `src/lib/`                                             |
| Theme, spacing, or responsive styles        | Ordered files imported by `src/styles/index.css`       |
| Favicon or downloadable workbook            | `public/`                                              |

Read [Architecture](architecture.md) for the full module map.

## Verify changes

```bash
npm run format
npm run format:check
npm test
npm run build
```

Browser checks cover all screens, record editing, property filters, persistence, property photos, and workbook/backup round trips:

```bash
npx playwright install chromium
npm run test:e2e
```

Or use an installed Google Chrome:

```bash
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

The browser suite automatically starts its own Vite server on port 5174 and stops it afterward. `npm run preview` serves the production build on port 4173.

## Existing records and backups

The app retains its existing browser storage keys and backup formats. Browser records remain local to the browser and origin where they were entered. Changing browser, hostname, or port creates a separate storage workspace.

Use **Data & export → Full backup with photos (JSON)** to preserve records and attachments. Excel exports include listing fields and reports, while full JSON backups include photos and floor plans.

Sections use hash URLs (`/#/clients`, `/#/properties`, etc.) that survive reload on static hosting. Malformed saved records open a recovery screen with the original data available for download. A failed write shows **Export full backup** and **Retry saving** controls; export before closing if retry still fails. The browser-local edition requires manual backups and does not synchronize between devices or browser tabs.

## Offline edition

The earlier zero-install app is preserved under `legacy/offline/`. Run `npm run offline` to serve it on port 4173, or see its [README](../legacy/offline/README.md). Develop the modern application in root `src/`.
