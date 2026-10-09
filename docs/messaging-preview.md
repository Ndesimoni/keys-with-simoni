# Client messaging frontend preview

Open **Messages** in the left navigation, then **Start a message**. You can also start directly with **Start email message** or **Start WhatsApp message**. The three-step overlay keeps recipient selection, writing and review separate.

## Recipients and channel

Choose **Email** or **WhatsApp**. Each channel has its own recipient list, so switching channels preserves the draft list for both. Enter one or several plain email addresses or international phone numbers, separated by commas, semicolons or new lines. Phone numbers accept spaces, brackets and hyphens; include a country code, such as `+971 50 123 4567` or `00971 50 123 4567`.

The composer normalizes phone numbers and email casing, removes duplicates, and displays the unique recipient count. Every entry must be valid before continuing; invalid entries are highlighted instead of silently omitted. The preview accepts up to 100 unique recipients.

Click or focus the recipient field to expand the saved-recipient picker inside the existing overlay. **Browse saved recipients** opens it with keyboard focus in **Search recipients**. Filter by **All**, **Clients**, **Leads** or **Landlords**, then search by name, email or phone. Rows show the chosen channel's address and their categories. Click a row to add it; the picker stays open for multiple selections. Recipient matches and review lists scroll continuously. Selected chips show six entries; More replaces that compact preview with one complete scrollable list and a close control, without duplicate chips. Closing it, pressing Escape within recipient controls, or moving focus outside them hides the picker without discarding the message. Escape dismisses the nearest More panel, then the picker, before the composer. See [Clean collection and option browsing](option-overflow.md).

Leads use the existing shared client profiles. The Clients filter also includes Contacts classified as Client; Landlords follows the existing Contacts landlord filter. All includes other saved contact types. A shared valid email or phone is represented once across categories, with all matching names/categories retained for search. Missing and invalid addresses are labelled and cannot be added; selected rows show a checkmark and **Added**. Adding saved recipients stops at 100 unique addresses.

Selected recipients appear as removable chips, including manually entered addresses. Removing a chip removes every duplicate of that address, retaining unrelated and invalid manual entries for correction. Manual entry and pasted lists remain available at all times. Switching channels preserves their independent lists and updates the picker to show the appropriate email addresses or phone numbers.

Bulk delivery is planned as individual messages containing the same text. It is not a WhatsApp group chat or an email CC list. The review lists all canonical recipients and the proposed sender before any future delivery integration.

## Starting from a client

- **Clients** and **Leads** have a chat icon on each row, labelled **Start message with [name]** for screen readers.
- Opening a client/lead record provides **Start message** in its details overlay.
- **Client desk → Contact this client → Start message** opens the same channel-selectable composer. The existing direct WhatsApp/email preview shortcuts remain available.

Starting from a client pre-fills both contact lists without editing the saved profile. The initial channel uses one the member is allowed to use, preferring a valid client contact detail. Recipients stay editable; additional people can be added manually or from the saved-recipient picker. Starting from record details replaces that overlay with the composer, keeping a single modal open.

## Writing, permissions and preview behavior

Email requires a subject and message; WhatsApp requires a message. The final review shows the selected channel, all recipients, content, proposed sender and **PREVIEW ONLY · NOT SENT** status. Email uses the member's profile address as its proposed sender; WhatsApp uses the proposed company business sender.

Super Admin channel permissions are checked when starting, when selecting recipients and again when completing the preview. Denied channels are disabled. A member with neither permission sees the Messages screen with an explanation and disabled start controls. The saved directory and chip names follow the relationship permission independently from messaging access; permitted manual messaging remains available without directory access.

Unsaved changes are protected during Cancel, Escape, navigation and page exit. Returning to earlier steps preserves recipient lists, subject and body. **Close preview** finishes the preview and discards its draft without a delivery request. Neither drafts nor conversation history are persisted in this stage. Existing client records, workbook columns, CRM backup formats and storage keys remain unchanged.

There is no connected messaging backend, outbound delivery, incoming chat or delivery log. Live email/WhatsApp sending and conversation history require authorized senders and backend authorization/delivery services. See [Team and messaging preview](team-access-preview.md) for account permissions and the existing provider boundary.

## Implementation and checks

`features/messaging/model.js` owns recipient parsing, validation, deduplication, chip removal, defaults and preview payloads. `recipients.js` provides pure directory merging, category classification and search; it reads the existing Clients and Contacts collections without changing them. `MessageAudience` owns the manual field, chips and picker disclosure; `RecipientPicker` owns search and categories. The shared `OverflowList` uses continuous scroll mode for matching/reviewed recipients and disclosure mode for selected chips. Expanded disclosure replaces the compact list and keeps one stable More/Close control for focus restoration. `MessageFields` and `MessageReview` are shared feature components. `MessageComposerDialog` uses the existing stepped modal and unsaved-change guard. The earlier single-recipient/staff preview now shares the same writing/review components. `useWorkspaceViewState` owns the open composer request; `useRecordActions.startMessage` enforces entry permissions and closes record details before opening it.

Messages has a reload-safe `/#/messages` route. The navigation contains 19 CRM sections, plus four settings/workspace routes; Calendar is deferred. The recipient directory uses only the selected profile's workspace. Completed previews add a scoped activity entry marked not sent without saving recipient addresses or message text. The original 17-sheet workbook format remains the same.

Run `npm test`, `npm run build`, `npm run format:check` and `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`. Messaging checks cover recipient validation/limits, normalized duplicates across categories, formatted-phone search, chip removal without losing invalid manual entries, full-result pagination, separate channel lists, saved client/lead/landlord selection, keyboard dismissal, client/lead actions, revoked channel/directory permissions during composition, unsaved drafts, unchanged CRM data/no delivery requests, and mobile/desktop layouts in both themes.
