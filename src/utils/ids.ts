let fallbackIdSequence = 0

const hasRandomUuid = (
  value: Crypto | undefined,
): value is Crypto & {
  randomUUID: () => string
} => typeof value?.randomUUID === 'function'

const createFallbackTodoId = (): string => {
  fallbackIdSequence += 1

  return `todo-${Date.now().toString(36)}-${fallbackIdSequence.toString(36)}`
}

export const createTodoId = (): string => {
  if (hasRandomUuid(globalThis.crypto)) {
    return globalThis.crypto.randomUUID()
  }

  return createFallbackTodoId()
}
