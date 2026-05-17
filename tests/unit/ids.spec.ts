import { afterEach, describe, expect, it, vi } from 'vitest'

describe('createTodoId', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('uses crypto.randomUUID when available', async () => {
    const randomUuid = vi.fn(() => 'uuid-123')

    vi.stubGlobal('crypto', {
      randomUUID: randomUuid,
    })

    const { createTodoId } = await import('@/utils/ids')

    expect(createTodoId()).toBe('uuid-123')
    expect(randomUuid).toHaveBeenCalledTimes(1)
  })

  it('falls back to a deterministic local id when randomUUID is unavailable', async () => {
    vi.stubGlobal('crypto', undefined)
    vi.spyOn(Date, 'now').mockReturnValue(1_746_000_000_000)

    const { createTodoId } = await import('@/utils/ids')

    expect(createTodoId()).toBe('todo-ma3nbi80-1')
    expect(createTodoId()).toBe('todo-ma3nbi80-2')
  })
})
