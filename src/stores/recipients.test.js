import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRecipientsStore } from './recipients.js'

const TEST_RECIPIENTS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', company: 'Acme', status: 'active' },
  { id: '2', name: 'Bob Martinez', email: 'bob@example.com', company: 'Globex', status: 'at-risk' },
  { id: '3', name: 'Carol Wang', email: 'carol.w@widgets.io', company: 'Widgets', status: 'inactive' },
]

describe('filteredRecipients', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useRecipientsStore()
    store.recipients = [...TEST_RECIPIENTS]
  })

  it('returns all recipients when searchQuery is empty', () => {
    store.searchQuery = ''
    expect(store.filteredRecipients).toEqual(TEST_RECIPIENTS)
  })

  it('filters by partial case-insensitive match on name', () => {
    store.searchQuery = 'alice'
    expect(store.filteredRecipients).toEqual([TEST_RECIPIENTS[0]])
  })

  it('filters by partial case-insensitive match on email', () => {
    store.searchQuery = 'widgets.io'
    expect(store.filteredRecipients).toEqual([TEST_RECIPIENTS[2]])
  })

  it('returns an empty array when nothing matches', () => {
    store.searchQuery = 'zzznomatch'
    expect(store.filteredRecipients).toEqual([])
  })

  it('returns all recipients when statusFilter is empty', () => {
    store.statusFilter = ''
    expect(store.filteredRecipients).toEqual(TEST_RECIPIENTS)
  })

  it('filters by statusFilter', () => {
    store.statusFilter = 'at-risk'
    expect(store.filteredRecipients).toEqual([TEST_RECIPIENTS[1]])
  })

  it('combines searchQuery and statusFilter', () => {
    store.searchQuery = 'a'
    store.statusFilter = 'inactive'
    expect(store.filteredRecipients).toEqual([TEST_RECIPIENTS[2]])
  })

  it('returns an empty array when searchQuery and statusFilter match different recipients', () => {
    store.searchQuery = 'alice'
    store.statusFilter = 'inactive'
    expect(store.filteredRecipients).toEqual([])
  })
})
