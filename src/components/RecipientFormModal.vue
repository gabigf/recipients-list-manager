<template>
  <div role="dialog" aria-modal="true">
    <h2>{{ props.mode === 'add' ? 'Add Recipient' : 'Edit Recipient' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="field-name">Name</label>
        <input
          id="field-name"
          ref="firstFieldRef"
          v-model="formData.name"
          type="text"
        />
        <span v-if="errors.name">{{ errors.name }}</span>
      </div>
      <div>
        <label for="field-email">Email</label>
        <input
          id="field-email"
          v-model="formData.email"
          type="text"
        />
        <span v-if="errors.email">{{ errors.email }}</span>
      </div>
      <div>
        <label for="field-company">Company</label>
        <input
          id="field-company"
          v-model="formData.company"
          type="text"
        />
      </div>
      <div>
        <label for="field-status">Status</label>
        <select id="field-status" v-model="formData.status">
          <option value="active">Active</option>
          <option value="at-risk">At Risk</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit">
        {{ props.mode === 'add' ? 'Add Recipient' : 'Save Changes' }}
      </button>
      <button type="button" @click="emit('close')">Cancel</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useRecipientsStore } from '../stores/recipients.js'

const props = defineProps({
  mode: { type: String, required: true },
  recipient: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const store = useRecipientsStore()
const firstFieldRef = ref(null)

const formData = reactive({ name: '', email: '', company: '', status: 'active' })
const errors = reactive({ name: '', email: '' })

watch(
  () => props.recipient,
  (updatedRecipient) => {
    if (updatedRecipient) {
      formData.name = updatedRecipient.name
      formData.email = updatedRecipient.email
      formData.company = updatedRecipient.company
      formData.status = updatedRecipient.status
    } else {
      formData.name = ''
      formData.email = ''
      formData.company = ''
      formData.status = 'active'
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await nextTick()
  firstFieldRef.value?.focus()
})

function validateForm() {
  errors.name = formData.name.trim() ? '' : 'Name is required.'
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(formData.email.trim())) {
    errors.email = 'Enter a valid email address.'
  } else {
    errors.email = ''
  }
  return !errors.name && !errors.email
}

function handleSubmit() {
  if (!validateForm()) return
  const submittedData = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    company: formData.company.trim(),
    status: formData.status,
  }
  if (props.mode === 'add') {
    store.addRecipient(submittedData)
  } else {
    store.updateRecipient(props.recipient.id, submittedData)
  }
  emit('close')
}
</script>
