import type { Todo, TodoFilter } from './todo.types'

export const getFilteredTodos = (todos: readonly Todo[], filter: TodoFilter): Todo[] => {
  if (filter === 'active') {
    return todos.filter((todo) => !todo.completed)
  }

  if (filter === 'completed') {
    return todos.filter((todo) => todo.completed)
  }

  return [...todos]
}

export const getActiveCount = (todos: readonly Todo[]): number =>
  todos.filter((todo) => !todo.completed).length

export const getCompletedCount = (todos: readonly Todo[]): number =>
  todos.filter((todo) => todo.completed).length

export const hasCompletedTodos = (todos: readonly Todo[]): boolean =>
  todos.some((todo) => todo.completed)
