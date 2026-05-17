import { TODO_TITLE_MAX_LENGTH, TODO_VALIDATION_MESSAGES } from './todo.constants'
import type { Todo, ValidationResult } from './todo.types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isIsoDate = (value: string): boolean => !Number.isNaN(Date.parse(value))

export const normalizeTodoTitle = (title: string): string => title.trim()

export const validateTodoTitle = (title: string): ValidationResult<string> => {
  const normalizedTitle = normalizeTodoTitle(title)

  if (!normalizedTitle) {
    return {
      ok: false,
      message: TODO_VALIDATION_MESSAGES.emptyTitle,
    }
  }

  if (normalizedTitle.length > TODO_TITLE_MAX_LENGTH) {
    return {
      ok: false,
      message: TODO_VALIDATION_MESSAGES.maxLength,
    }
  }

  return {
    ok: true,
    value: normalizedTitle,
  }
}

export const validateTodoEntity = (value: unknown): ValidationResult<Todo> => {
  if (!isRecord(value)) {
    return { ok: false, message: TODO_VALIDATION_MESSAGES.invalidSnapshot }
  }

  const titleResult = validateTodoTitle(typeof value.title === 'string' ? value.title : '')
  const normalizedTitle = titleResult.ok ? titleResult.value : undefined

  if (
    typeof value.id !== 'string' ||
    typeof value.completed !== 'boolean' ||
    typeof value.createdAt !== 'string' ||
    typeof value.updatedAt !== 'string' ||
    !isIsoDate(value.createdAt) ||
    !isIsoDate(value.updatedAt) ||
    !normalizedTitle
  ) {
    return { ok: false, message: TODO_VALIDATION_MESSAGES.invalidSnapshot }
  }

  return {
    ok: true,
    value: {
      id: value.id,
      title: normalizedTitle,
      completed: value.completed,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    },
  }
}
