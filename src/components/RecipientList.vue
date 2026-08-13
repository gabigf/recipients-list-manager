<template>
  <div class="recipient-table-wrapper">
    <table class="recipient-table">
      <thead>
        <tr>
          <th class="checkbox-col">
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
            />
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Company</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="recipient in store.filteredRecipients" :key="recipient.id">
          <td class="checkbox-col">
            <input
              type="checkbox"
              :checked="store.selectedIds.has(recipient.id)"
              @change="toggleRecipient(recipient.id)"
            />
          </td>
          <td>{{ recipient.name }}</td>
          <td>{{ recipient.email }}</td>
          <td>{{ recipient.company }}</td>
          <td>
            <span :class="['status-badge', `status-badge--${recipient.status}`]">
              {{ statusLabel(recipient.status) }}
            </span>
          </td>
          <td class="actions-col">
            <button class="action-btn" @click="emit('edit', recipient.id)">Edit</button>
            <button class="action-btn action-btn--danger" @click="confirmDelete(recipient)">Delete</button>
          </td>
        </tr>
        <tr v-if="store.filteredRecipients.length === 0 && store.recipients.length === 0">
          <td colspan="6" class="empty-state">No recipients yet.</td>
        </tr>
        <tr v-else-if="store.filteredRecipients.length === 0">
          <td colspan="6" class="empty-state">No recipients match your search.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRecipientsStore } from '../stores/recipients.js';

const store = useRecipientsStore();
const emit = defineEmits(['edit']);

const isAllSelected = computed(
  () =>
    store.filteredRecipients.length > 0 &&
    store.filteredRecipients.every((recipient) =>
      store.selectedIds.has(recipient.id),
    ),
);

function toggleRecipient(recipientId) {
  const updatedIds = new Set(store.selectedIds);
  if (updatedIds.has(recipientId)) {
    updatedIds.delete(recipientId);
  } else {
    updatedIds.add(recipientId);
  }
  store.selectedIds = updatedIds;
}

function confirmDelete(recipient) {
  if (window.confirm(`Delete ${recipient.name}?`)) {
    store.deleteRecipient(recipient.id)
  }
}

const STATUS_LABELS = { active: 'Active', 'at-risk': 'At Risk', inactive: 'Inactive' }
function statusLabel(status) {
  return STATUS_LABELS[status] ?? status
}

function toggleSelectAll() {
  const allFilteredIds = store.filteredRecipients.map(
    (recipient) => recipient.id,
  );
  if (isAllSelected.value) {
    store.selectedIds = new Set();
  } else {
    store.selectedIds = new Set(allFilteredIds);
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.recipient-table-wrapper {
  overflow-x: auto;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  background: $color-surface;
  margin-top: $space-4;
}

.recipient-table {
  width: 100%;
  border-collapse: collapse;
  font-size: $font-size-sm;

  th {
    background: $color-bg;
    color: $color-text-secondary;
    font-size: $font-size-xs;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: $space-3 $space-4;
    text-align: left;
    border-bottom: 1px solid $color-border;
    white-space: nowrap;
  }

  td {
    padding: $space-3 $space-4;
    border-bottom: 1px solid $color-border;
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background: $color-bg;
  }
}

.checkbox-col {
  width: 2.5rem;
  text-align: center;
}

.actions-col {
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  font-size: $font-size-xs;
  font-weight: 600;
  white-space: nowrap;

  &--active {
    background: $status-active-bg;
    color: $status-active-text;
  }

  &--at-risk {
    background: $status-at-risk-bg;
    color: $status-at-risk-text;
  }

  &--inactive {
    background: $status-inactive-bg;
    color: $status-inactive-text;
  }
}

.action-btn {
  background: transparent;
  color: $color-text-secondary;
  border: 1px solid $color-border;
  padding: $space-1 $space-3;
  font-size: $font-size-xs;

  & + & {
    margin-left: $space-2;
  }

  &:hover {
    background: $color-bg;
    color: $color-text;
  }

  &--danger:hover {
    background: $status-inactive-bg;
    color: $status-inactive-text;
    border-color: $status-inactive-text;
  }
}

.empty-state {
  color: $color-text-secondary;
  text-align: center;
  padding: $space-8 $space-4;
  font-style: italic;
}
</style>
