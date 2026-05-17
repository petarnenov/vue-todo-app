import { createStoragePayload, parseStoragePayload } from './storageSchema'

import { TODO_VALIDATION_MESSAGES } from '@/domain/todo.constants'
import type { Todo } from '@/domain/todo.types'
import { appConfig } from '@/config/appConfig'

export interface StorageReadResult {
  ok: boolean
  data?: Todo[]
  message?: string
}

export interface StorageWriteResult {
  ok: boolean
  message?: string
}

export interface TodoStorageService {
  read(): StorageReadResult
  write(todos: readonly Todo[]): StorageWriteResult
}

const resolveStorage = (storage?: Storage): StorageReadResult & { storage?: Storage } => {
  if (storage) {
    return { ok: true, storage }
  }

  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      ok: false,
      message: TODO_VALIDATION_MESSAGES.storageUnavailable,
    }
  }

  return {
    ok: true,
    storage: window.localStorage,
  }
}

export const createTodoStorage = (storage?: Storage): TodoStorageService => ({
  read() {
    const storageResult = resolveStorage(storage)

    if (!storageResult.ok || !storageResult.storage) {
      return storageResult
    }

    try {
      const rawValue = storageResult.storage.getItem(appConfig.storageKey)

      if (rawValue === null) {
        return { ok: true, data: [] }
      }

      const parsedResult = parseStoragePayload(rawValue)

      if (!parsedResult.ok || !parsedResult.data) {
        return {
          ok: false,
          message: parsedResult.message,
        }
      }

      return {
        ok: true,
        data: parsedResult.data.todos,
      }
    } catch {
      return {
        ok: false,
        message: TODO_VALIDATION_MESSAGES.storageUnavailable,
      }
    }
  },
  write(todos) {
    const storageResult = resolveStorage(storage)

    if (!storageResult.ok || !storageResult.storage) {
      return storageResult
    }

    try {
      storageResult.storage.setItem(
        appConfig.storageKey,
        JSON.stringify(createStoragePayload(todos)),
      )

      return { ok: true }
    } catch {
      return {
        ok: false,
        message: TODO_VALIDATION_MESSAGES.writeFailed,
      }
    }
  },
})

export const todoStorage = createTodoStorage()
