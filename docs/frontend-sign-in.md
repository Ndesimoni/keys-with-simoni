# Frontend sign-in preview

The React app opens at `/#/sign-in` before mounting the CRM workspace. Email and password are required. Aidah and Simoni both have the fixed **Admin** role and access to all 19 CRM screens. Successful sign-in opens the dashboard; a valid session allows normal deep links and refresh.

## Sample credentials

These are public demo details for the frontend preview:

| Admin  | Demo email                 | Demo password   |
| ------ | -------------------------- | --------------- |
| Aidah  | aidah@keyswithsimoni.test  | SimoniDemo2026! |
| Simoni | simoni@keyswithsimoni.test | SimoniDemo2026! |

The email addresses are placeholders until the real addresses are supplied. The password is a public sample, not a password to reuse for a real account. The sign-in page shows these details. Edit `src/config/demoAccounts.js` to change the preview profiles.

## Behavior

- The form validates required fields and email format, masks the password, and offers Show/Hide. Unrecognized demo credentials stay on the sign-in screen with a clear error.
- The header account button and sidebar identify the current admin. The account panel shows their email, fixed role and **Sign out** link. It closes with Escape, clicking outside, or moving keyboard focus away.
- Only `{ version: 1, adminId }` is stored in the tab's `sessionStorage`, under `kws-crm-demo-session`. Entered passwords are never saved, logged or sent to a server.
- Signing out clears this identity. It preserves records, property media, backups, targets and theme preferences. It uses a router transition so the record editor can block navigation when a draft or media upload is unfinished. File operations must finish first; failed record saves prompt before discarding in-memory work.
- Invalid sessions return to sign-in. Session write/clear failures show errors; a failed sign-out can be retried without falsely reporting success.
- Dark mode remains the default. The sign-in theme switch honors and updates the same preference as the dashboard. Mobile layouts fit the viewport in both themes.

## Frontend boundary

This is a demo sign-in flow, not authentication or a security boundary. Credential matching runs in the browser and the sample details are public. It does not verify identity, protect browser records, scope Google access to an admin profile, or create a shared database.

Both demo admins use the same records and Google Calendar connection in the same browser and origin. A different browser, device, hostname or port still has its own records. The existing local Calendar companion remains independent of this demo identity.

Production sign-in needs a server to verify real accounts, enforce the two-admin allowlist and role, establish protected sessions, and authorize all CRM and Calendar requests. Password reset, server session expiry, and shared records belong to that phase. Replace `services/auth/demoAuth.js` and the session repository/provider with that integration; keep the form and profile components.

## Verification

Run `npm test`, `npm run build`, `npm run format:check`, and `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` (or the installed Playwright browser). Sign-in browser tests cover the signed-out gate, validation, both admins, reload/history, retained records, mobile themes, storage failures, and the unsaved editor guard. Existing CRM tests sign in through the form before exercising their workflows.
