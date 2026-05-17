import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TodoFilters from '@/components/TodoFilters.vue'

describe('TodoFilters', () => {
  it('marks the current filter and emits changes', async () => {
    const wrapper = mount(TodoFilters, {
      props: {
        currentFilter: 'active',
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[2]?.trigger('click')

    expect(buttons[1]?.attributes('aria-pressed')).toBe('true')
    expect(wrapper.emitted('change')).toEqual([['completed']])
  })
})
