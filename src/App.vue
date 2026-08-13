<template>
  <main>
    <h1>Recipients List Manager</h1>
    <button @click="openAddModal">Add Recipient</button>
    <SearchBar />
    <RecipientList @edit="openEditModal" />
    <BulkActionsBar />
    <RecipientFormModal
      v-if="isModalOpen"
      :mode="modalMode"
      :recipient="editingRecipient"
      @close="closeModal"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import RecipientList from './components/RecipientList.vue';
import RecipientFormModal from './components/RecipientFormModal.vue';
import SearchBar from './components/SearchBar.vue';
import BulkActionsBar from './components/BulkActionsBar.vue';
import { useRecipientsStore } from './stores/recipients.js';

const store = useRecipientsStore();
const isModalOpen = ref(false);
const modalMode = ref('add');
const editingRecipient = ref(null);
let focusReturnTarget = null;

function openAddModal() {
  focusReturnTarget = document.activeElement;
  modalMode.value = 'add';
  editingRecipient.value = null;
  isModalOpen.value = true;
}

function openEditModal(recipientId) {
  focusReturnTarget = document.activeElement;
  modalMode.value = 'edit';
  editingRecipient.value = store.recipients.find(
    (recipient) => recipient.id === recipientId,
  );
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingRecipient.value = null;
  focusReturnTarget?.focus();
}
</script>

<style lang="scss">
main {
  padding: 2rem;
}
</style>
