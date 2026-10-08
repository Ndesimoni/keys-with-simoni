# Keys with Simoni — Real Estate CRM v1.2

A premium, responsive **React application** created from all **17 worksheets** of the existing **Keys with Simoni Real Estate CRM Enhanced** Excel workbook.

The full project includes a conventional **React 18 + Vite** source application **and** a stand-alone/offline React build for using the product immediately without installing packages.

## What changed in v1.2

- **Editorial design refresh:** consistent emerald, gold, neutral surfaces; improved typographic hierarchy, text contrast, input sizes, spacing, hover/focus states; both light and dark themes, desktop and mobile.
- **Property media studio:** upload up to 8 JPEG/PNG/WebP property photos (converted to compressed JPEG), change cover photo, remove images; attach up to 3 image/PDF floor plans per listing, then open/download attachments in property details.
- **Listing presentation:** select amenities with quick-add chips; record bedrooms, bathrooms, parking, key selling points, marketing descriptions, viewing instructions, virtual tour and floor plan links.
- **Full backup (JSON):** Data & export → Full backup with photos (JSON) includes attached media and all other CRM records; Restore full backup (JSON) restores them.
- **Excel interoperability:** 17-tab Excel export/import includes 8 more editable property listing fields (amenities, bathrooms, descriptions, etc.). Embedded photos/PDF files are _not_ included in Excel exports.

### Important media limitations

This remains a **local-first prototype** without a cloud database or object storage. Photo/PDF files are stored directly with the property records in the browser's localStorage. Photos are downscaled/compressed automatically, PDFs have a small 450 KB cap, and there is a conservative ~2.9-million-character capacity guard for the local workspace. For larger property portfolios, add PostgreSQL and S3-compatible storage with access control. **Always export the full JSON backup** to preserve photographs and floor plans, because Excel exports contain listing fields only. Do not store real client personal data in a shared or untrusted browser.

## Quick start — use the app now

**Option A: open immediately (no npm needed)**

1. Extract the ZIP.
2. Open `legacy/offline/public/index.html` in Chrome, Edge or Safari. If your browser restricts local files, serve the `legacy/offline/public/` folder using a local HTTP server:

```bash
cd Keys_with_Simoni_VSCode_Starter
python3 -m http.server 4173 --directory legacy/offline/public
```

3. Visit `http://localhost:4173`.

The offline edition uses a bundled React runtime and locally bundled JavaScript utilities. The refined theme uses local system fonts, so no internet connection is required.

**Option B: develop the modern React application (recommended for engineering work)**

Requires Node.js 20+ and npm access for package installation.

```bash
cd Keys_with_Simoni_VSCode_Starter
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The modern source entry is `src/main.jsx` and the product implementation is `src/app/App.jsx`, using React 18 hooks, Vite, JSZip and responsive CSS.

```bash
npm run build    # generates dist/ for production-ready static hosting
npm run preview  # inspect that build
npm test         # code + workbook schema smoke tests
```

To rebuild the additional zero-install React preview after editing `legacy/offline/src/App.jsx`, run `npm run build:offline` (requires the project's dev dependencies). Its prebuilt files are already included, so rebuilding isn't needed just to use the app.

## All 17 workbook sheets mapped

| Original worksheet | React experience                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard          | Branded overview, KPIs, fee trends, tasks, deal stages, lead sources and upcoming viewings                                                        |
| Deals              | Deal/commission ledger, pipeline types, earned/outstanding fee calculations                                                                       |
| Clients            | Leads, budgets, financing, scoring and client qualification                                                                                       |
| Contacts           | Landlords, clients, owners, developers, brokers and suppliers                                                                                     |
| Properties         | Purpose tabs (sale, long-term rent, holiday homes, off-plan and commercial), property types, beds, emirate, availability, price basis and permits |
| Follow-ups         | Activity queue, overdue dates, task status and linked records                                                                                     |
| Viewings           | Appointments, status, feedback and next action                                                                                                    |
| Payments           | Fee receipts, VAT fields, per-deal history                                                                                                        |
| Expenses           | Paid operating expenses and campaign references                                                                                                   |
| Guide              | Interactive nine-step daily operating workflow                                                                                                    |
| Shortlist          | Client/property recommendation records                                                                                                            |
| Client desk        | Searchable client profiles, automatically filtered matching properties, timeline                                                                  |
| Date search        | Date range filters across eight transaction/activity categories                                                                                   |
| Performance        | Rolling 12 months, editable goals, fees and conversion KPIs                                                                                       |
| Interaction log    | Calls, WhatsApp contacts, questions, objections, commitments                                                                                      |
| Client care        | Renewals, referrals, long-term relationships, investor touchpoints                                                                                |
| CRM insights       | Hot/Warm/Nurture distribution, pipeline mix and lost-lead intelligence                                                                            |

The **11 data-entry sheets retain the original 200 workbook field definitions**, with 11 additional property fields for flexible pricing, occupancy, and listing presentation. Record editing and detail panels expose those fields and automatically recalculate formula-derived information.

## Working features

- Add, view, edit, search, sort, filter and delete business records.
- Link clients, owners, properties, viewings, deals, receipts, shortlists and conversations using their IDs.
- Calculate personal commission estimates after brokerage/partner splits.
- Identify outstanding earned fees based on linked payments.
- Score leads with weighted qualification criteria or a manually entered score.
- Automatically match available listings to clients by budget, community and sale/rental category.
- Track pending activities and overdue reminders **inside the app**.
- Edit monthly targets and see updated KPI progress.
- Import original or app-exported Excel `.xlsx` sheets; export a new **17-sheet `.xlsx`** with matching data columns and report snapshots.
- Download the preserved **original formatted Excel template** separately.
- Switch between persistent **light and dark themes** using the button in the top bar.
- Browse property inventory by listing purpose, property type, location, listing status, completion, bedrooms, and maximum asking price/rate; switch between cards and table.
- Use total-price, annual, monthly, weekly, or nightly rate units. Holiday homes can include minimum stay and guest capacity.
- Work with a desktop, tablet, or mobile layout.
- Start with clearly marked **fictional DEMO DATA**, or choose **Data & export → Start with blank CRM**.

## File layout

The current folder structure and development commands are documented in the [project README](../README.md). See [Architecture](architecture.md) for component, feature, state, and utility responsibilities. The preserved offline edition lives under `legacy/offline/`.

## Security and production roadmap

This release is a **functional front-end MVP**, not a production multi-user SaaS or a brokerage backend. Data is persisted in the current browser's `localStorage` only; it is **not** encrypted, centrally backed up, synchronized across devices, or protected by a server login. Export data regularly and do not use a shared or public device for real customer records.

To deploy for use with real UAE clients, the next engineering phase should add PostgreSQL, secure authenticated API endpoints, role-based access control, audit history, encrypted backups, real scheduled reminders, and a storage/consent policy appropriate for UAE privacy regulations. No WhatsApp API, email sending, DLD/RERA integration, map integration or push notifications are claimed in this version.

**Excel interoperability note:** Imported record values are mapped into the application. Exported 17-sheet files carry the data columns and calculated results, but **do not preserve the original workbook's Excel cell styling/formula expressions**. The app includes a separate download of the original formatted workbook for reference.

**React compatibility note:** The modern Vite edition uses standard React 18 hooks. The self-contained offline edition uses a locally bundled older React UMD runtime with a tiny hooks adapter so it requires no package download.

## Original v1.2 creation checks

- Original workbook mapped: 17 sheets; 200 editable-sheet columns.
- Desktop screenshot verified (1440 px), mobile screenshot verified (390 px).
- All 17 screens rendered successfully in Chromium with zero JavaScript exceptions.
- Add/search client, open deal detail, and Excel export/import flows exercised in Chromium.
- Round-tripped XLSX verified to have 17 worksheets and preserve a newly added client.
- Modern JSX transpiled without syntax diagnostics. These checks describe the original creation environment. Use the current README commands to verify the modern project.

## Step-by-step forms

Clients, Properties, Deals, Interaction log, and Client care now show one logical section at a time. Use **Next** to check the current section and continue, or **Back** to revisit it. Progress shows your current step; previously visited steps remain available. When editing an existing record, select any step directly. Shorter forms, including Contacts, stay on one page.

Entered information and uploaded property media remain in the open form as you move between steps. Multi-section records are saved only after **Review & save**, where **Edit section** returns to the relevant fields. Final validation checks the complete record and opens the first section needing a correction. Escape, Cancel, and navigation still ask before discarding unsaved changes. Closing or reloading an unsaved form discards its draft; this does not add draft persistence.

Property sections cover basic details, location/specifications, pricing/availability, photos/presentation, and listing/documents. **Add property photos** opens the presentation step directly. Field keys, workbook columns, calculations, and backups remain compatible.

## Contact filters

Use **All**, **Landlords**, **Clients**, and **Other contacts** on Contacts to filter the directory by **Contact type**. The category combines with search and column sorting; changing it returns to the first results page. Add or edit a contact and select **Client** or **Landlord** to classify it. The Clients filter shows contacts classified as Client; client requirements and lead management remain in the Clients section.

Other contacts includes owners, developers, brokers, partners, suppliers, Other, and imported or unclassified types. Filtering leaves stored records unchanged, and All restores every category. Contact types continue using the existing workbook column and backup field.

## Property filters & pricing

The **For sale**, **For rent**, **Holiday homes**, **Off-plan**, and **Commercial** controls on Properties are actual filters and show counts. Each can be combined with property type, emirate, listing status, completion, bedroom count, and maximum asking price/rate. The search box finds addresses and project names; **Clear all filters** resets the view.

Existing imported Excel property rows remain compatible. The new `Price basis`, `Minimum stay (nights)` and `Maximum guests` columns are appended after the original fields in the CRM exported XLSX. `Sale / rental` now also accepts `Holiday home`. Pricing basis is inferred when missing (sales = total, rent = annual, holiday home = nightly), and can be overridden in the property editor. No live rental platform, booking calendar, or public listing integration is included.

Appearance is stored in browser preferences (`kws-crm-preferences`), independently of business records.

## Current development setup

See [Getting started](getting-started.md) and [Architecture](architecture.md). Styles live in `src/styles/index.css`. Vite serves assets from root `public/`; the independent offline prototype lives in `legacy/offline/`.

## Modern frontend foundations

The modern app now has section URLs that survive reload, keyboard-accessible dialogs, inline form validation, unsaved-edit protection, and recovery controls for unreadable or unsaved browser records. All record modules share the same create/edit/detail flow. Global search opens the matching Client desk profile, and reports handle month-end and historical month selections correctly.

If a saved workspace cannot open, **Download saved data** preserves the original payload for recovery. Replacing it with an empty workspace requires an explicit confirmation. If saving fails, use **Export full backup** or **Retry saving** before closing the page. Manual full backups are still required; this frontend does not provide a shared database, accounts, automated reminders, or cloud media storage. These improvements apply to the modern app; the archived offline prototype retains its own implementation.
