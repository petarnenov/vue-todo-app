import { describe, expect, it, vi } from 'vitest'

const { createArguslogMock } = vi.hoisted(() => ({
  createArguslogMock: vi.fn((options: unknown) => options),
}))

vi.mock('@arguslog/sdk-vue', () => ({
  createArguslog: createArguslogMock,
}))

import { installArguslog } from '@/arguslog'

const createAppMock = () =>
  ({
    use: vi.fn(),
  }) as unknown as Parameters<typeof installArguslog>[0]

describe('installArguslog', () => {
  it('ignores Arguslog connectivity probe synthetic events', () => {
    const env = import.meta.env as Record<string, string | undefined>
    const previousDsn = env.VITE_ARGUSLOG_DSN
    env.VITE_ARGUSLOG_DSN = 'arguslog://public@example.com/api/1'

    const app = createAppMock()
    installArguslog(app)

    expect(createArguslogMock).toHaveBeenCalledTimes(1)
    const config = createArguslogMock.mock.calls[0][0] as {
      beforeSend: (event: { message?: string }) => { message?: string } | null
    }

    expect(
      config.beforeSend({
        message: 'ArguslogConnectivityProbe: Copilot CLI integration smoke test for vue-todo-app',
      }),
    ).toBeNull()

    const regularEvent = { message: 'action=create_todo status=failure' }
    expect(config.beforeSend(regularEvent)).toBe(regularEvent)

    env.VITE_ARGUSLOG_DSN = previousDsn
  })
})
