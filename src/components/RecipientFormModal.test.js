import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RecipientFormModal from './RecipientFormModal.vue'

const EDIT_RECIPIENT = {
  id: 'test-id-123',
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Acme Corp',
  status: 'at-risk',
}

describe('RecipientFormModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('pre-fills fields correctly when opened in edit mode with an existing recipient', async () => {
    const wrapper = mount(RecipientFormModal, {
      props: { mode: 'edit', recipient: EDIT_RECIPIENT },
      global: { plugins: [createPinia()] },
    })

    await nextTick()

    expect(wrapper.find('#field-name').element.value).toBe('Jane Doe')
    expect(wrapper.find('#field-email').element.value).toBe('jane@example.com')
    expect(wrapper.find('#field-company').element.value).toBe('Acme Corp')
    expect(wrapper.find('#field-status').element.value).toBe('at-risk')
  })

  it('renders empty fields when opened in add mode', async () => {
    const wrapper = mount(RecipientFormModal, {
      props: { mode: 'add', recipient: null },
      global: { plugins: [createPinia()] },
    })

    await nextTick()

    expect(wrapper.find('#field-name').element.value).toBe('')
    expect(wrapper.find('#field-email').element.value).toBe('')
    expect(wrapper.find('#field-company').element.value).toBe('')
    expect(wrapper.find('#field-status').element.value).toBe('active')
  })

  it('blocks submission and shows an error when a required field is empty', async () => {
    const wrapper = mount(RecipientFormModal, {
      props: { mode: 'add', recipient: null },
      global: { plugins: [createPinia()] },
    })

    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(wrapper.html()).toContain('Name is required.')
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('blocks submission and shows an error for an invalid email format', async () => {
    const wrapper = mount(RecipientFormModal, {
      props: { mode: 'add', recipient: null },
      global: { plugins: [createPinia()] },
    })

    await wrapper.find('#field-name').setValue('Test User')
    await wrapper.find('#field-email').setValue('not-an-email')
    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(wrapper.html()).toContain('Enter a valid email address.')
    expect(wrapper.emitted('close')).toBeFalsy()
  })
})
