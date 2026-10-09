# Clean collection and option browsing

Choose the browsing pattern for the task. Do not apply a six-item limit to every collection, and never show the same items twice above and below an expanded panel.

| Feature                                        | Presentation                                                                                                                                                                            |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Property inventory                             | One card grid with 12 properties per page, range/count and Previous/Next controls. Cards use normal page scrolling; table/card views share the page. Search and filters reset the page. |
| Recipient search and review                    | Complete lists in bounded scroll areas, with existing search, category filters and selection states. No More step.                                                                      |
| Client desk                                    | One scrollable client chooser; one scrollable set of property matches. Selecting a client preserves its position and profile.                                                           |
| Date search and activity                       | Complete filtered results in scrollable areas. Filters and headings remain outside the scroll area.                                                                                     |
| Team members                                   | One scrollable member table with existing search, status filters and actions.                                                                                                           |
| Workspace directory and roles                  | Complete card collections with natural page scrolling. No second panel.                                                                                                                 |
| Photos                                         | All uploaded photos remain visible in the editor; gallery/review thumbnails scroll horizontally.                                                                                        |
| Form sections                                  | All step controls in a horizontal scroll row. Step numbering and unlock rules remain unchanged.                                                                                         |
| Amenity editor                                 | All choices in a bounded scroll area, preserving selected values.                                                                                                                       |
| Selected recipient chips and amenity summaries | Six compact entries and More when needed. Opening More replaces the compact view with one complete scrollable list and a close control.                                                 |
| Leads                                          | Six source filters including All sources; More opens the existing floating menu with every source and All sources.                                                                      |

`components/ui/OverflowList.jsx` supports `disclosure` (the default), `scroll`, and `all` modes. A disclosure renders only one copy of the items. Its More control becomes the close button in the same container, preserving keyboard focus and dialog-return targets. Escape, outside pointer/focus and close dismiss it; multiple selections remain available for repeated edits. Lists of six or fewer entries do not show More.

`components/ui/Pagination.jsx` provides count/range and page controls for property cards. The current page is clamped after record changes, including deleting the only record on the last page. Changing pages focuses and scrolls to the collection. Native record-table pagination, dropdowns and primary navigation retain their established patterns.

The models retain complete collections. Selections, drafts, totals, property media, exports, workspace isolation, workbook mappings and backup formats remain unchanged. Dark and light themes use semantic surfaces and text colors; mobile views retain readable cards, visible form footers and bounded scroll areas.

Validate with `npm test`, `npm run build`, `npm run format:check` and `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`. Browser checks cover duplicate-free expansion, recipient/amenity changes, scrolling, page switching/reset/deletion, card/table continuity, keyboard focus, profile access and desktop/mobile layouts in both themes.
