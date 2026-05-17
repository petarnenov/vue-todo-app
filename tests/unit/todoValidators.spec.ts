import { describe, expect, it } from 'vitest'

import { TODO_TITLE_MAX_LENGTH } from '@/domain/todo.constants'
import { validateTodoEntity, validateTodoTitle } from '@/domain/todo.validators'

describe('validateTodoTitle', () => {
  it('trims and accepts valid titles', () => {
    const result = validateTodoTitle('  Buy milk  ')

    expect(result).toEqual({
      ok: true,
      value: 'Buy milk',
    })
  })

  it('rejects empty titles', () => {
    const result = validateTodoTitle('   ')

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Please enter a todo title.')
  })

  it('rejects titles over the configured max length', () => {
    const result = validateTodoTitle('a'.repeat(TODO_TITLE_MAX_LENGTH + 1))

    expect(result.ok).toBe(false)
    expect(result.message).toContain(`${TODO_TITLE_MAX_LENGTH}`)
  })
})

describe('validateTodoEntity', () => {
  it('normalizes valid raw todo values', () => {
    const result = validateTodoEntity({
      id: 'todo-1',
      title: '  Normalized title  ',
      completed: false,
      createdAt: '2026-05-17T10:00:00.000Z',
      updatedAt: '2026-05-17T10:00:00.000Z',
    })

    expect(result).toEqual({
      ok: true,
      value: {
        id: 'todo-1',
        title: 'Normalized title',
        completed: false,
        createdAt: '2026-05-17T10:00:00.000Z',
        updatedAt: '2026-05-17T10:00:00.000Z',
      },
    })
  })

  it('rejects invalid todo payloads', () => {
    const result = validateTodoEntity({
      id: 'todo-1',
      title: '',
      completed: 'nope',
    })

    expect(result.ok).toBe(false)
  })
})
