import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from '@/App.vue'
import { todoStorage } from '@/services/todoStorage'
import { todoTelemetry } from '@/services/telemetry'

describe('App', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.restoreAllMocks()
    vi.spyOn(todoStorage, 'read').mockReturnValue({ ok: true, data: [] })
    vi.spyOn(todoStorage, 'write').mockReturnValue({ ok: true })
    vi.spyOn(todoTelemetry, 'trackCreateAttempt').mockImplementation(() => undefined)
    vi.spyOn(todoTelemetry, 'trackCreateSuccess').mockImplementation(() => undefined)
    vi.spyOn(todoTelemetry, 'trackCreateFailure').mockImplementation(() => undefined)
    vi.spyOn(todoTelemetry, 'trackCreateUnexpectedFailure').mockImplementation(() => undefined)
    vi
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue('123e4567-e89b-12d3-a456-426614174000')
  })

  it('adds a todo on submit without rendering the global fallback', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs: {
          ArguslogErrorBoundary: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    await wrapper.get('input[name="todo-title"]').setValue('Buy milk')
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Buy milk')
    expect(wrapper.text()).toContain('powered by Arguslog.org')
    expect(wrapper.text()).not.toContain('Something went wrong.')
  })

  it('renders the app attribution in the empty state', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs: {
          ArguslogErrorBoundary: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('powered by Arguslog.org')
  })
})
