import { describe, expect, it, vi } from 'vitest'

import * as todoDates from '@/utils/dates'
import * as todoIds from '@/utils/ids'
import { createTodo } from '@/domain/todo.mapper'

describe('createTodo', () => {
  it('creates a complete todo without throwing for valid input', () => {
    vi.spyOn(todoDates, 'getCurrentIsoDate').mockReturnValue('2026-05-17T10:00:00.000Z')
    vi.spyOn(todoIds, 'createTodoId').mockReturnValue('todo-123')

    expect(() => createTodo('  Buy milk  ')).not.toThrow()
    expect(createTodo('  Buy milk  ')).toEqual({
      id: 'todo-123',
      title: 'Buy milk',
      completed: false,
      createdAt: '2026-05-17T10:00:00.000Z',
      updatedAt: '2026-05-17T10:00:00.000Z',
    })
  })
})
