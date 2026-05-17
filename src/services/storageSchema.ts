import { appConfig } from '@/config/appConfig'
import { TODO_VALIDATION_MESSAGES } from '@/domain/todo.constants'
import { validateTodoEntity } from '@/domain/todo.validators'
import type { Todo } from '@/domain/todo.types'

interface TodoStoragePayload {
  version: number
  todos: Todo[]
}

interface SchemaResult {
  ok: boolean
  data?: TodoStoragePayload
  message?: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export const createStoragePayload = (todos: readonly Todo[]): TodoStoragePayload => ({
  version: appConfig.storageVersion,
  todos: [...todos],
})

export const parseStoragePayload = (value: string): SchemaResult => {
  let parsedValue: unknown

  try {
    parsedValue = JSON.parse(value)
  } catch {
    return {
      ok: false,
      message: TODO_VALIDATION_MESSAGES.invalidSnapshot,
    }
  }

  if (!isRecord(parsedValue)) {
    return {
      ok: false,
      message: TODO_VALIDATION_MESSAGES.invalidSnapshot,
    }
  }

  if (parsedValue.version !== appConfig.storageVersion) {
    return {
      ok: false,
      message: TODO_VALIDATION_MESSAGES.unsupportedVersion,
    }
  }

  if (!Array.isArray(parsedValue.todos)) {
    return {
      ok: false,
      message: TODO_VALIDATION_MESSAGES.invalidSnapshot,
    }
  }

  const todos: Todo[] = []

  for (const rawTodo of parsedValue.todos) {
    const result = validateTodoEntity(rawTodo)

    if (!result.ok || !result.value) {
      return {
        ok: false,
        message: TODO_VALIDATION_MESSAGES.invalidSnapshot,
      }
    }

    todos.push(result.value)
  }

  return {
    ok: true,
    data: {
      version: appConfig.storageVersion,
      todos,
    },
  }
}
