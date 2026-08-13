<template>
  <div>
    <label for="search-input">Search</label>
    <input
      id="search-input"
      type="text"
      :value="store.searchQuery"
      placeholder="Filter by name or email"
      @input="store.searchQuery = $event.target.value"
    />
  </div>
</template>

<script setup>
import { useRecipientsStore } from '../stores/recipients.js'

const store = useRecipientsStore()
</script>
