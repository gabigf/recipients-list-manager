<template>
  <main>
    <h1>Recipients List Manager</h1>
    <div class="app-toolbar">
      <button class="btn-add" @click="openAddModal">Add Recipient</button>
      <SearchBar />
    </div>
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
@use './styles/variables' as *;

main {
  max-width: 1100px;
  margin: 0 auto;
  padding: $space-8 $space-6;
}

h1 {
  font-size: $font-size-2xl;
  font-weight: 700;
  margin: 0 0 $space-6;
}

.app-toolbar {
  display: flex;
  align-items: center;
  gap: $space-4;
  margin-bottom: $space-6;

  @media (max-width: 480px) {
    align-items: flex-end;
  }
}

.btn-add {
  flex-shrink: 0;
  white-space: nowrap;
  background-color: $color-primary;
  color: #fff;
  border-color: $color-primary;

  &:hover {
    background-color: $color-primary-hover;
    border-color: $color-primary-hover;
  }
}
</style>
