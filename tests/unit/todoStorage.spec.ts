import { describe, expect, it } from 'vitest'

import { appConfig } from '@/config/appConfig'
import { createTodoStorage } from '@/services/todoStorage'

class FakeStorage implements Storage {
  public length = 0

  private readonly store = new Map<string, string>()

  clear(): void {
    this.store.clear()
    this.length = 0
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
    this.length = this.store.size
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
    this.length = this.store.size
  }
}

describe('todoStorage', () => {
  it('reads valid persisted todos', () => {
    const storage = new FakeStorage()
    storage.setItem(
      appConfig.storageKey,
      JSON.stringify({
        version: appConfig.storageVersion,
        todos: [
          {
            id: 'todo-1',
            title: 'Saved todo',
            completed: false,
            createdAt: '2026-05-17T10:00:00.000Z',
            updatedAt: '2026-05-17T10:00:00.000Z',
          },
        ],
      }),
    )

    const result = createTodoStorage(storage).read()

    expect(result).toEqual({
      ok: true,
      data: [
        {
          id: 'todo-1',
          title: 'Saved todo',
          completed: false,
          createdAt: '2026-05-17T10:00:00.000Z',
          updatedAt: '2026-05-17T10:00:00.000Z',
        },
      ],
    })
  })

  it('returns an explicit error for corrupted payloads', () => {
    const storage = new FakeStorage()
    storage.setItem(appConfig.storageKey, '{"version":1,"todos":"oops"}')

    const result = createTodoStorage(storage).read()

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Saved todos were corrupted. The app reset to an empty list.')
  })

  it('returns an explicit error when writes fail', () => {
    const storage: Storage = {
      length: 0,
      clear: () => undefined,
      getItem: () => null,
      key: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new Error('Quota exceeded')
      },
    }

    const result = createTodoStorage(storage).write([
      {
        id: 'todo-1',
        title: 'Test',
        completed: false,
        createdAt: '2026-05-17T10:00:00.000Z',
        updatedAt: '2026-05-17T10:00:00.000Z',
      },
    ])

    expect(result).toEqual({
      ok: false,
      message: 'Changes are visible, but could not be saved locally.',
    })
  })
})
