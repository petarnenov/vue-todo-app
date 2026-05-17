import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTodoStore } from '@/stores/todoStore'
import { todoTelemetry } from '@/services/telemetry'
import { todoStorage } from '@/services/todoStorage'

describe('useTodoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.spyOn(todoTelemetry, 'trackCreateAttempt').mockImplementation(() => undefined)
    vi.spyOn(todoTelemetry, 'trackCreateSuccess').mockImplementation(() => undefined)
    vi.spyOn(todoTelemetry, 'trackCreateFailure').mockImplementation(() => undefined)
    vi.spyOn(todoTelemetry, 'trackCreateUnexpectedFailure').mockImplementation(() => undefined)
  })

  it('hydrates todos from storage', () => {
    vi.spyOn(todoStorage, 'read').mockReturnValue({
      ok: true,
      data: [
        {
          id: 'todo-1',
          title: 'Hydrated todo',
          completed: false,
          createdAt: '2026-05-17T10:00:00.000Z',
          updatedAt: '2026-05-17T10:00:00.000Z',
        },
      ],
    })

    const store = useTodoStore()
    store.hydrate()

    expect(store.isHydrated).toBe(true)
    expect(store.todos).toHaveLength(1)
    expect(store.errorMessage).toBeNull()
  })

  it('falls back to an empty state when hydration fails', () => {
    vi.spyOn(todoStorage, 'read').mockReturnValue({
      ok: false,
      message: 'Saved todos were corrupted. The app reset to an empty list.',
    })

    const store = useTodoStore()
    store.hydrate()

    expect(store.todos).toEqual([])
    expect(store.errorTone).toBe('error')
    expect(store.errorMessage).toContain('corrupted')
  })

  it('adds todos, trims titles, and persists state', () => {
    const writeSpy = vi.spyOn(todoStorage, 'write').mockReturnValue({ ok: true })
    vi.spyOn(todoStorage, 'read').mockReturnValue({ ok: true, data: [] })

    const store = useTodoStore()
    store.hydrate()

    const result = store.addTodo('  Buy milk  ')

    expect(result.ok).toBe(true)
    expect(store.todos[0]?.title).toBe('Buy milk')
    expect(writeSpy).toHaveBeenCalledTimes(1)
  })

  it('keeps in-memory state when persistence fails', () => {
    vi.spyOn(todoStorage, 'read').mockReturnValue({ ok: true, data: [] })
    vi.spyOn(todoStorage, 'write').mockReturnValue({
      ok: false,
      message: 'Changes are visible, but could not be saved locally.',
    })

    const store = useTodoStore()
    store.hydrate()
    const result = store.addTodo('Draft change')

    expect(result).toEqual({
      ok: true,
      kind: 'persistence',
      message: 'Changes are visible, but could not be saved locally.',
    })
    expect(store.todos).toHaveLength(1)
    expect(store.errorTone).toBe('warning')
    expect(store.errorMessage).toContain('could not be saved')
  })

  it('returns typed validation failures without changing state', () => {
    vi.spyOn(todoStorage, 'read').mockReturnValue({ ok: true, data: [] })

    const store = useTodoStore()
    store.hydrate()

    const result = store.addTodo('   ')

    expect(result).toEqual({
      ok: false,
      kind: 'validation',
      message: 'Please enter a todo title.',
    })
    expect(store.todos).toEqual([])
  })

  it('filters todos and clears completed entries', () => {
    vi.spyOn(todoStorage, 'read').mockReturnValue({
      ok: true,
      data: [
        {
          id: 'todo-1',
          title: 'Active todo',
          completed: false,
          createdAt: '2026-05-17T10:00:00.000Z',
          updatedAt: '2026-05-17T10:00:00.000Z',
        },
        {
          id: 'todo-2',
          title: 'Completed todo',
          completed: true,
          createdAt: '2026-05-17T10:00:00.000Z',
          updatedAt: '2026-05-17T10:00:00.000Z',
        },
      ],
    })
    vi.spyOn(todoStorage, 'write').mockReturnValue({ ok: true })

    const store = useTodoStore()
    store.hydrate()
    store.setFilter('completed')

    expect(store.filteredTodos).toHaveLength(1)
    expect(store.activeCount).toBe(1)

    store.clearCompleted()

    expect(store.todos).toHaveLength(1)
    expect(store.todos[0]?.title).toBe('Active todo')
  })
})
