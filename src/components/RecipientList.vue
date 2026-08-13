<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>
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
          <td>
            <input
              type="checkbox"
              :checked="store.selectedIds.has(recipient.id)"
              @change="toggleRecipient(recipient.id)"
            />
          </td>
          <td>{{ recipient.name }}</td>
          <td>{{ recipient.email }}</td>
          <td>{{ recipient.company }}</td>
          <td>{{ recipient.status }}</td>
          <td>
            <button @click="emit('edit', recipient.id)">Edit</button>
            <button @click="confirmDelete(recipient)">Delete</button>
          </td>
        </tr>
        <tr v-if="store.filteredRecipients.length === 0 && store.recipients.length === 0">
          <td colspan="6">No recipients yet.</td>
        </tr>
        <tr v-else-if="store.filteredRecipients.length === 0">
          <td colspan="6">No recipients match your search.</td>
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
