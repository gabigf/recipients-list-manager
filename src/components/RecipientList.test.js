import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RecipientList from './RecipientList.vue'
import { useRecipientsStore } from '../stores/recipients.js'

const TEST_RECIPIENT = {
  id: 'abc-123',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  company: 'Acme',
  status: 'active',
}

describe('RecipientList', () => {
  let store
  let wrapper

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useRecipientsStore()
    store.recipients = [TEST_RECIPIENT]
    wrapper = mount(RecipientList, {
      global: { plugins: [pinia] },
    })
  })

  it('calls deleteRecipient when the confirm dialog is accepted', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(store, 'deleteRecipient')

    const deleteButton = wrapper.findAll('button').find(
      (button) => button.text() === 'Delete',
    )
    await deleteButton.trigger('click')

    expect(window.confirm).toHaveBeenCalledWith(`Delete ${TEST_RECIPIENT.name}?`)
    expect(store.deleteRecipient).toHaveBeenCalledWith(TEST_RECIPIENT.id)
  })

  it('does not call deleteRecipient when the confirm dialog is canceled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    vi.spyOn(store, 'deleteRecipient')

    const deleteButton = wrapper.findAll('button').find(
      (button) => button.text() === 'Delete',
    )
    await deleteButton.trigger('click')

    expect(window.confirm).toHaveBeenCalled()
    expect(store.deleteRecipient).not.toHaveBeenCalled()
  })
})
