# Recipients List Manager

A single-page Recipients List Manager built with Vue 3 (Composition API), Pinia, and SCSS. Supports viewing, adding, editing, and deleting recipients, searching by name or email, and bulk actions (delete or status change) on multiple selected recipients. Data persists to `localStorage`, no backend required.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Start the dev server:
   ```
   npm run dev
   ```
   Open the local URL shown in your terminal.

## Running Tests

```
npm test
```

Tests cover:

- Store logic: the `filteredRecipients` getter (search matching on name/email, empty query, no matches)
- `RecipientFormModal`: pre-filling in edit mode, empty fields in add mode, and validation for required fields and email format
- Delete confirmation: single-row and bulk delete only proceed when confirmed, verified for `RecipientList` and `BulkActionsBar`

## Assumptions & Trade-offs

- **State management:** Used Pinia for the recipients store. For an app of this size I'd typically reach for a composable, but chose Pinia to reflect the stack this role works in day to day.
- **Persistence:** `localStorage` stands in for a backend. In production this would be API calls with optimistic updates and loading/error states.
- **Design system:** Used a small set of SCSS variables (colors, spacing, type scale) instead of a UI framework, to stay lightweight within the time budget.
- **Search:** Filters live as you type, no debounce. This is filtering ~15 in-memory records with no network costs; I'd add a debounce if this were backed by a remote API or a much larger dataset.
- **Select-all with an active search:** Select-all only applies to the currently visible/filtered rows. Clearing the search afterward doesn't retroactively select recipients that were filtered out.
- **Delete confirmation:** Used the browser's native `window.confirm()` for single and bulk delete rather than a custom dialog, to keep scope tight within the time budget.
- **Mobile:** Took a minimal approach, the table scrolls horizontally on narrow viewports rather than collapsing into a stacked-card layout.
- **Accessibility:** Not required by the brief, but included deliberately, it's an area I'm actively building expertise in and wanted to practice here: labeled inputs, visible focus states, keyboard-operable checkboxes and bulk actions, focus management on modal open/close, an `aria-live` region for bulk action confirmations, and status shown with a text label, not color alone.

## What I'd Improve With More Time

- More polished empty states (illustrations/icons) instead of a plain one-line message
- A full responsive layout (stacked cards) on mobile instead of horizontal scroll
- A custom-styled confirm dialog instead of the browser's native `window.confirm()`
- Loading/error states and optimistic updates if this were connected to a real API
- Keyboard navigation currently relies on native tab order through each row's controls (checkbox, edit, delete). For a larger dataset, I'd implement the WAI-ARIA grid pattern with roving tabindex so arrow keys navigate between cells instead of tabbing through every control.
