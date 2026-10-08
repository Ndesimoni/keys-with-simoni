# Preserved offline edition

This folder contains the original, independent offline CRM prototype. Modern application development uses the root `src/` folder.

```text
src/App.jsx       Original offline JSX implementation
public/           Ready-to-open HTML, bundled app, styles, schema, and demo data
public/vendor/    Bundled React, ReactDOM, JSZip, and hooks adapter
public/data/      Original workbook copy used by the offline edition
tests/            Historical Python checks from the original creation environment
```

From the project root:

```bash
npm run offline
```

Open <http://localhost:4173>. You can also open `legacy/offline/public/index.html` directly if your browser permits local-file storage.

To rebuild this edition after editing its own source:

```bash
npm run build:offline
npm run test:offline
```

The historical Python scripts retain their original creation-environment assumptions, including `/mnt/data` paths and external release artifacts. They are preserved as reference material and are outside the active test suite. Use the root `tests/browser` suite for modern-app regression checks.
