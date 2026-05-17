import type { TodoFilter } from './todo.types'

export const TODO_TITLE_MAX_LENGTH = 160

export const TODO_FILTERS: ReadonlyArray<{ label: string; value: TodoFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

export const TODO_VALIDATION_MESSAGES = {
  emptyTitle: 'Please enter a todo title.',
  maxLength: `Todo title must be ${TODO_TITLE_MAX_LENGTH} characters or fewer.`,
  missingTodo: 'The selected todo could not be found.',
  invalidSnapshot: 'Saved todos were corrupted. The app reset to an empty list.',
  unsupportedVersion: 'Saved todos use an unsupported storage version.',
  storageUnavailable: 'Todo storage is unavailable in this environment.',
  writeFailed: 'Changes are visible, but could not be saved locally.',
} as const
