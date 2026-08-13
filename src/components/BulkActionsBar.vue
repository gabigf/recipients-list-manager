<template>
  <div v-if="store.selectedIds.size > 0" class="bulk-actions-bar">
    <span class="selection-count">{{ store.selectedIds.size }} selected</span>
    <button class="btn btn--danger" @click="handleBulkDelete">Delete Selected</button>
    <div class="status-update">
      <select v-model="pendingStatus" class="status-select">
        <option value="active">Active</option>
        <option value="at-risk">At Risk</option>
        <option value="inactive">Inactive</option>
      </select>
      <button class="btn btn--secondary" @click="handleBulkStatusUpdate">Apply Status</button>
    </div>
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

<style lang="scss" scoped>
@use '../styles/variables' as *;

.bulk-actions-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $space-3;
  position: fixed;
  bottom: $space-6;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  max-width: calc(100vw - #{$space-6 * 2});
  padding: $space-3 $space-4;
  background: $color-surface;
  border: 1px solid #BFDBFE;
  border-radius: $radius-lg;
  box-shadow: $shadow-lg;
}

.selection-count {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $color-primary;
  margin-right: $space-1;
}

.status-update {
  display: flex;
  align-items: center;
  gap: $space-2;
  margin-left: auto;
}

.btn--danger {
  background-color: $color-danger;
  color: #fff;
  border-color: $color-danger;

  &:hover {
    background-color: $color-danger-hover;
    border-color: $color-danger-hover;
  }
}

.btn--secondary {
  background-color: $color-surface;
  color: $color-text;
  border-color: $color-border;

  &:hover {
    background-color: $color-bg;
  }
}
</style>
