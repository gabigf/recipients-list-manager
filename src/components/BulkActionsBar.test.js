import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BulkActionsBar from './BulkActionsBar.vue'
import { useRecipientsStore } from '../stores/recipients.js'

describe('BulkActionsBar', () => {
  let store
  let wrapper

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useRecipientsStore()
    store.selectedIds = new Set(['test-id-1'])
    wrapper = mount(BulkActionsBar, {
      global: { plugins: [pinia] },
    })
  })

  it('calls bulkDelete when the confirm dialog is accepted', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(store, 'bulkDelete')

    const deleteButton = wrapper.findAll('button').find(
      (button) => button.text() === 'Delete Selected',
    )
    await deleteButton.trigger('click')

    expect(window.confirm).toHaveBeenCalledWith('Delete 1 selected recipient(s)?')
    expect(store.bulkDelete).toHaveBeenCalled()
  })

  it('does not call bulkDelete when the confirm dialog is canceled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    vi.spyOn(store, 'bulkDelete')

    const deleteButton = wrapper.findAll('button').find(
      (button) => button.text() === 'Delete Selected',
    )
    await deleteButton.trigger('click')

    expect(window.confirm).toHaveBeenCalled()
    expect(store.bulkDelete).not.toHaveBeenCalled()
  })
})
