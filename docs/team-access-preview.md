# Team and messaging frontend preview

This prototype includes **Team & access**, **My profile**, **Workspaces** and **Team activity**. There are 19 active CRM sections including the [Messages preview](messaging-preview.md); Calendar is deferred. It runs entirely in the browser. Accounts, permissions and invitation links demonstrate the proposed experience; they do not authenticate real users or deliver messages. See [Private workspaces and team activity](private-workspaces.md) for the ownership model.

## Try the complete flow

1. Sign in as Aidah or Simoni using the public password `SimoniDemo2026!`.
2. Open **Settings → Team & access → Set up Super Admin**. Complete personal details, the demo password step and the review. Alternatively, use **Preview Super Admin setup** from sign-in.
3. Enter a required phone number with its country code, for example `+971 50 123 4567`. Choose whether to receive WhatsApp work updates.
4. The selected profile becomes the only Super Admin. Existing demo profiles without phone numbers become pending invitations, retaining their identities and Admin roles. All existing CRM records stay in place.
5. Choose **Invite member**, enter the name/email, assign a role, grant each client messaging channel separately, then review. The invitation screen provides **Open preview** and **Copy link**. No email or WhatsApp invitation is sent.
6. Open the invitation preview to act as the invited person. Add the required phone number, choose work-update preferences and enter the public demo password. Activation opens that person's dashboard with the assigned access. Sign out to return to another profile.

Links work only in the browser and origin containing this team preview. They expire after seven days and become unavailable after activation, revocation or renewal. Invitations can be renewed or revoked from **Manage member**. These are local revision-based links, not production authentication tokens.

## Roles and profile management

| Role          | Initial CRM access                                    | Team and role management      |
| ------------- | ----------------------------------------------------- | ----------------------------- |
| Super Admin   | All sections and data tools                           | Yes; exactly one active owner |
| Admin         | All sections and data tools                           | No                            |
| Receptionist  | Leads, clients, contacts, appointments and follow-ups | No                            |
| Staff / Agent | Receptionist access plus properties and shortlists    | No                            |
| Custom role   | Selected permission groups                            | No                            |

The Super Admin creates custom roles, changes assigned roles and client messaging permissions, edits contact details, initiates password-reset previews, and suspends/restores accounts. Built-in roles remain templates. A custom role cannot be removed while assigned to a member, including pending invitations. Role edits immediately affect assigned profiles.

**My profile** lets members update their own name, required phone, email and work-update preference. They cannot change their own role or grant themselves client messaging permissions. Active-account email changes remain pending until **Preview email verification → Open preview → Confirm email preview** is completed; the original login remains valid until then. This simulates verification without sending an email.

Password creation/reset uses only the public demo password. No entered password is stored, sent, shown to another member or added to a backup. Password reset previews consume their links; they do not change the shared sample password. A real authentication service will let each member choose their own private password and verify email ownership.

Ownership can be transferred to another active member with a valid phone. The recipient becomes the only Super Admin; the former owner becomes an Admin. The owner cannot be suspended or demoted through ordinary member editing.

## Phone numbers and client messaging

Three controls are independent:

- A **required international phone number** identifies where the member can be reached.
- **Receive work updates on WhatsApp** opts the member into future staff messages and reminders. The Super Admin can preview a staff message from their management screen when this preference is enabled.
- **Send WhatsApp messages to clients** and **Send emails to clients** are separate permissions granted by the Super Admin. Selecting a role sets its initial channel defaults; these can be adjusted before saving.

The **Client desk → Contact this client** panel offers permitted channels when the client has the corresponding contact details. Compose a message, then review the **PREVIEW ONLY · NOT SENT** screen. Closing the preview discards the draft. Sender status stays **Not connected**.

**Messages → Start a message** adds one or several manually entered recipients or saved clients. Client/lead rows, details and the Client desk provide the same channel-selectable **Start message** action with profile contact details pre-filled. Recipient validation and duplicate removal apply; see [Messaging preview](messaging-preview.md).

The proposed live WhatsApp sender is the company business account, with the member recorded as the author. A personal phone number alone does not connect a sender. Live email will require the member to authorize their own supported mailbox; a login email alone does not permit the CRM to send from that address. Google's [Gmail send API](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send) requires authorized scopes. Provider connections, message delivery and communication history remain backend work.

## Architecture and storage

- `config/team.js`: role templates, permission groups, route permissions and storage key.
- `features/team/model.js`: pure setup, invitation, activation, profile, role and ownership commands plus validation.
- `services/storage/teamRepository.js`: validated reads/writes, known-field serialization and recovery.
- `app/TeamProvider.jsx`: commits persistence before reporting success; write failure keeps the previous team state. Storage events reload team changes from another tab.
- `app/SessionProvider.jsx`: resolves the tab's identity against current active members and roles. Suspension invalidates a member's session.
- `features/team/TeamWizard.jsx`: shared stepped forms, validation, focus, unsaved-change protection and success navigation.
- `features/team/`: setup, activation, team directory, role editor, profile and recovery screens.
- `features/messaging/MessagePreviewDialog.jsx`: permitted compose/review previews with no delivery API.

The `kws-crm-team-preview-v1` local-storage key contains profile/contact details, roles, access flags, statuses and preview-link revisions/expiry. Passwords and provider tokens are excluded. The original CRM/preference keys retain the Super Admin organisation data, and personal records/targets use per-member keys; workbook columns and full JSON backup formats stay compatible. CRM backups do not include team configuration or activity. A malformed team store is preserved and offers retry/raw-data download through Team & access or My profile; failed writes leave existing details unchanged.

Tab sessions still store only `{ version: 1, adminId }` under `kws-crm-demo-session`. No team configuration is written until an explicit setup/profile command. Legacy demo sign-in continues to work before setup.

## Backend boundary and verification

Permission groups control navigation, dashboards, route rendering and record/file actions within each member's personal workspace. Admins cannot open another member's records. Only the Super Admin may switch workspaces and see their activity. Reports, exports and message-recipient search use the selected workspace; module permissions still apply. Browser-local code and storage are not a secure authorization boundary. The backend must enforce ownership and trusted activity logging. Calendar integration is deferred.

Production needs server-verified accounts, protected sessions, email verification, secure invitation/reset tokens, enforced authorization on every CRM/Calendar/message request, shared records and authorized sender connections. Phone details and profile edits will also require server validation. No provider credentials or real password setup is added by this prototype.

Run `npm test`, `npm run build`, `npm run format:check` and `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`. Team checks cover required phone entry, role/channel invariants, invitation expiry/renewal/revocation, profile/email/reset flows, custom roles, ownership transfer, storage failures, and desktop/mobile layouts in both themes. Existing CRM regression checks remain in the same suite.
