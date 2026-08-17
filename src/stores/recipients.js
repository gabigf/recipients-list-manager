import { watch } from 'vue';
import { defineStore } from 'pinia';
import seedData from '../data/recipients.json';

const STORAGE_KEY = 'recipients';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    console.warn('Failed to load recipients from storage');
  }
  return null;
}

export const useRecipientsStore = defineStore('recipients', {
  state: () => ({
    recipients: loadFromStorage() ?? [...seedData],
    searchQuery: '',
    statusFilter: '',
    selectedIds: new Set(),
  }),

  getters: {
    filteredRecipients(state) {
      const query = state.searchQuery.trim().toLowerCase();
      return state.recipients.filter((recipient) => {
        const matchesQuery =
          !query ||
          recipient.name.toLowerCase().includes(query) ||
          recipient.email.toLowerCase().includes(query);
        const matchesStatus =
          !state.statusFilter || recipient.status === state.statusFilter;
        return matchesQuery && matchesStatus;
      });
    },
  },

  actions: {
    addRecipient(data) {
      this.recipients.push({ id: crypto.randomUUID(), ...data });
    },

    updateRecipient(id, data) {
      const index = this.recipients.findIndex(
        (recipient) => recipient.id === id,
      );
      if (index !== -1)
        this.recipients[index] = { ...this.recipients[index], ...data };
    },

    deleteRecipient(id) {
      this.recipients = this.recipients.filter(
        (recipient) => recipient.id !== id,
      );
    },

    bulkDelete() {
      this.recipients = this.recipients.filter(
        (recipient) => !this.selectedIds.has(recipient.id),
      );
      this.selectedIds = new Set();
    },

    bulkUpdateStatus(status) {
      this.recipients = this.recipients.map((recipient) =>
        this.selectedIds.has(recipient.id)
          ? { ...recipient, status }
          : recipient,
      );
      this.selectedIds = new Set();
    },

    setupPersistence() {
      watch(
        () => this.recipients,
        (updatedRecipients) => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipients));
        },
        { deep: true },
      );
    },
  },
});
