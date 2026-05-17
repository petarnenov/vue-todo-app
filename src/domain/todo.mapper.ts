import { getCurrentIsoDate } from '@/utils/dates'
import { createTodoId } from '@/utils/ids'

import { normalizeTodoTitle } from './todo.validators'
import type { Todo } from './todo.types'

export const createTodo = (title: string): Todo => {
  const now = getCurrentIsoDate()

  return {
    id: createTodoId(),
    title: normalizeTodoTitle(title),
    completed: false,
    createdAt: now,
    updatedAt: now,
  }
}

export const updateTodoTitle = (todo: Todo, title: string): Todo => ({
  ...todo,
  title: normalizeTodoTitle(title),
  updatedAt: getCurrentIsoDate(),
})

export const toggleTodoCompletion = (todo: Todo): Todo => ({
  ...todo,
  completed: !todo.completed,
  updatedAt: getCurrentIsoDate(),
})
