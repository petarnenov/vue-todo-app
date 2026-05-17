import { useArguslog } from '@arguslog/sdk-vue'

import { runtimeEnv } from '@/config/runtimeEnv'
import type { TodoActionFailureKind } from '@/domain/todo.types'

type CreateTodoTelemetryStatus = 'attempt' | 'success' | 'failure'

interface CreateTodoTelemetryMetadata {
  titleLength?: number
  totalTodos?: number
}

const buildCreateTodoEventMessage = (
  status: CreateTodoTelemetryStatus,
  failureKind?: TodoActionFailureKind,
  metadata: CreateTodoTelemetryMetadata = {},
): string => {
  const messageParts = [
    'action=create_todo',
    `status=${status}`,
    `environment=${runtimeEnv.environment}`,
    `release=${runtimeEnv.release ?? 'unknown'}`,
  ]

  if (failureKind) {
    messageParts.push(`failureKind=${failureKind}`)
  }

  if (typeof metadata.titleLength === 'number') {
    messageParts.push(`titleLength=${metadata.titleLength}`)
  }

  if (typeof metadata.totalTodos === 'number') {
    messageParts.push(`totalTodos=${metadata.totalTodos}`)
  }

  return messageParts.join(' ')
}

const toTelemetryError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error
  }

  return new Error(typeof error === 'string' ? error : 'Unexpected create_todo failure')
}

export const todoTelemetry = {
  trackCreateAttempt(metadata: CreateTodoTelemetryMetadata = {}): void {
    useArguslog().captureMessage(buildCreateTodoEventMessage('attempt', undefined, metadata), 'info')
  },
  trackCreateSuccess(metadata: CreateTodoTelemetryMetadata = {}): void {
    useArguslog().captureMessage(buildCreateTodoEventMessage('success', undefined, metadata), 'info')
  },
  trackCreateFailure(
    failureKind: Extract<TodoActionFailureKind, 'validation' | 'persistence'>,
    metadata: CreateTodoTelemetryMetadata = {},
  ): void {
    useArguslog().captureMessage(buildCreateTodoEventMessage('failure', failureKind, metadata), 'warning')
  },
  trackCreateUnexpectedFailure(
    error: unknown,
    metadata: CreateTodoTelemetryMetadata = {},
  ): void {
    const arguslog = useArguslog()

    arguslog.captureMessage(buildCreateTodoEventMessage('failure', 'unexpected', metadata), 'error')
    arguslog.captureException(toTelemetryError(error), {
      level: 'error',
      tags: {
        action: 'create_todo',
        failureKind: 'unexpected',
      },
    })
  },
}
