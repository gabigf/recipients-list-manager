<template>
  <div v-if="store.selectedIds.size > 0">
    <span>{{ store.selectedIds.size }} selected</span>
    <button @click="handleBulkDelete">Delete Selected</button>
    <select v-model="pendingStatus">
      <option value="active">Active</option>
      <option value="at-risk">At Risk</option>
      <option value="inactive">Inactive</option>
    </select>
    <button @click="handleBulkStatusUpdate">Apply Status</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRecipientsStore } from '../stores/recipients.js'

const store = useRecipientsStore()
const pendingStatus = ref('active')

function handleBulkDelete() {
  if (window.confirm(`Delete ${store.selectedIds.size} selected recipient(s)?`)) {
    store.bulkDelete()
  }
}

function handleBulkStatusUpdate() {
  store.bulkUpdateStatus(pendingStatus.value)
}
</script>
