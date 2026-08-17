<template>
  <div class="search-bar">
    <label class="search-label" for="search-input">Search</label>
    <input
      id="search-input"
      class="search-input"
      type="text"
      :value="store.searchQuery"
      placeholder="Filter by name or email"
      @input="store.searchQuery = $event.target.value"
    />
    <label class="status-filter-label" for="status-filter-select">Status</label>
    <select
      id="status-filter-select"
      class="status-filter-select"
      :value="store.statusFilter"
      @change="store.statusFilter = $event.target.value"
    >
      <option value="">All Statuses</option>
      <option value="active">Active</option>
      <option value="at-risk">At Risk</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
</template>

<script setup>
import { useRecipientsStore } from '../stores/recipients.js'

const store = useRecipientsStore()
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.search-bar {
  display: flex;
  align-items: center;
  gap: $space-2;
  flex: 1;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: $space-1;
  }
}

.search-label {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $color-text-secondary;
  white-space: nowrap;
}

.search-input {
  flex: 1;
  max-width: 360px;
  margin-right: $space-4;

  @media (max-width: 480px) {
    max-width: none;
    margin-right: 0;
  }
}

.status-filter-label {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $color-text-secondary;
  white-space: nowrap;
}

.status-filter-select {
  flex-shrink: 0;
}
</style>
