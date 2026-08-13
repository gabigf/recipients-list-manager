<template>
  <div class="modal-overlay">
    <div class="modal-box" role="dialog" aria-modal="true">
      <h2 class="modal-title">{{ props.mode === 'add' ? 'Add Recipient' : 'Edit Recipient' }}</h2>
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-field">
          <label for="field-name">Name</label>
          <input
            id="field-name"
            ref="firstFieldRef"
            v-model="formData.name"
            type="text"
          />
          <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
        </div>
        <div class="form-field">
          <label for="field-email">Email</label>
          <input
            id="field-email"
            v-model="formData.email"
            type="text"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>
        <div class="form-field">
          <label for="field-company">Company</label>
          <input
            id="field-company"
            v-model="formData.company"
            type="text"
          />
        </div>
        <div class="form-field">
          <label for="field-status">Status</label>
          <select id="field-status" v-model="formData.status">
            <option value="active">Active</option>
            <option value="at-risk">At Risk</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary">
            {{ props.mode === 'add' ? 'Add Recipient' : 'Save Changes' }}
          </button>
          <button type="button" class="btn btn--ghost" @click="emit('close')">Cancel</button>
        </div>
      </form>
    </div>
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

<style lang="scss" scoped>
@use '../styles/variables' as *;

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: $space-4;
}

.modal-box {
  background: $color-surface;
  border-radius: $radius-lg;
  padding: $space-8;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: $shadow-lg;
}

.modal-title {
  margin: 0 0 $space-6;
  font-size: $font-size-xl;
  font-weight: 700;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: $space-1;

  label {
    font-size: $font-size-sm;
    font-weight: 500;
  }

  input,
  select {
    width: 100%;
  }
}

.field-error {
  font-size: $font-size-xs;
  color: $color-danger;
}

.form-actions {
  display: flex;
  gap: $space-3;
  justify-content: flex-end;
  margin-top: $space-2;
}

.btn--primary {
  background-color: $color-primary;
  color: #fff;
  border-color: $color-primary;

  &:hover {
    background-color: $color-primary-hover;
    border-color: $color-primary-hover;
  }
}

.btn--ghost {
  background: transparent;
  color: $color-text-secondary;
  border-color: $color-border;

  &:hover {
    background: $color-bg;
    color: $color-text;
  }
}
</style>
