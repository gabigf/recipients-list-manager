# Recipients List Manager: Plan

## Stack

- Vue 3, Composition API, `<script setup>`
- JavaScript
- SCSS for styling: variables act as a lightweight design token system (colors, spacing, type), no UI framework
- Pinia for state management
- Vite scaffold
- Vitest + Vue Test Utils for testing
- `localStorage` for persistence, seeded from a static JSON array on first load

## Data model

```js
{
  id: string,       // crypto.randomUUID()
  name: string,
  email: string,
  company: string,
  status: 'active' | 'at-risk' | 'inactive'
}
```

## Component tree

- `App.vue`: layout shell
- `RecipientList.vue`: table, row checkboxes, select-all; scrolls horizontally on narrow viewports
- `RecipientFormModal.vue`: single lightweight modal, reused for add and edit (just the four fields: name, email, company, status)
- `SearchBar.vue`: filters by name/email
- `BulkActionsBar.vue`: appears when selections exist; bulk delete / bulk status change
- `store/recipients.js`: Pinia store: state, filtered getter, CRUD + bulk actions

Modal open/closed state and which recipient (if any) is being edited are local UI state, kept in `App.vue` rather than the Pinia store, to keep the store scoped to domain data.

## State shape & actions (Pinia store)

**State**
- `recipients`: array of recipient objects
- `searchQuery`: string
- `selectedIds`: Set of selected recipient ids

**Getters**
- `filteredRecipients`: recipients filtered by `searchQuery` against name/email

**Actions**
- `addRecipient(data)`
- `updateRecipient(id, data)`
- `deleteRecipient(id)`
- `bulkDelete()`: operates on current `selectedIds`, clears selection after
- `bulkUpdateStatus(status)`: applies `status` to current `selectedIds`, clears selection after
- persistence: `watch(recipients, ...)` writing to `localStorage`

## Search

- Live filtering as you type, bound directly to `searchQuery`, no submit button, no debounce (in-memory array of ~10-15 records, filtering cost is negligible; debounce would be worth adding if this were backed by a real API call)
- Matches partial, case-insensitive against name and email
- Select-all is scoped to the currently filtered/visible rows, not the full list; clearing the search afterward doesn't retroactively add unseen recipients to the selection
- No dedicated clear (×) button on the input, native clearing is enough

## Styling

- SCSS variables defined in one `_variables.scss` partial: colors, spacing, type scale
- Status badges: light-tint background + darker text of the same hue (WCAG AA contrast), text label always shown alongside color:
  - Active: `$status-active-bg: #DCFCE7` / `$status-active-text: #15803D`
  - At Risk: `$status-at-risk-bg: #FFEDD5` / `$status-at-risk-text: #C2410C`
  - Inactive: `$status-inactive-bg: #FEE2E2` / `$status-inactive-text: #B91C1C`
- Mobile: minimal approach, table scrolls horizontally on narrow viewports (no stacked-card layout)
- Empty states: simple one-line message ("No recipients yet" / "No recipients match your search")

## Accessibility (differentiator, not required by brief)

- Labeled form inputs, visible focus states
- Keyboard-operable checkboxes and bulk actions
- Focus management on form modal open/close
- `aria-live` region for bulk action confirmations
- Status shown with text label, not color alone

## Testing

**Store test, `filteredRecipients`**
1. Returns all recipients when `searchQuery` is empty
2. Filters by partial, case-insensitive match on name
3. Filters by partial, case-insensitive match on email
4. Returns an empty array when nothing matches

**Component test, `RecipientFormModal.vue`**
1. Pre-fills fields correctly when opened in edit mode with an existing recipient
2. Renders empty fields when opened in add mode
3. Blocks submission and shows an error when a required field is empty
4. Blocks submission and shows an error for an invalid email format

## Decisions & trade-offs log

*(I'll append to this as I build: it becomes the basis for the README's assumptions and trade-offs section.)*

- **State management:** Used Pinia for the recipients store. For an app of this size I'd typically reach for a composable, but chose Pinia here to reflect the stack this role works in day to day.
- **Persistence:** `localStorage` stands in for a backend. In production this would be API calls with optimistic updates and loading/error states.
- **Design system:** Small set of SCSS variables instead of a UI framework, to stay lightweight within the time budget.
- **Mobile:** Minimal horizontal-scroll approach chosen over a full responsive redesign to stay within the time budget.
- **Empty states:** Kept intentionally simple; noted as an area to improve with more time (illustrations/icons).
- **Search:** Filters live as you type, no debounce, since this is filtering ~15 in-memory records with no network cost. Would add one if this were backed by a remote API or a much larger dataset.
