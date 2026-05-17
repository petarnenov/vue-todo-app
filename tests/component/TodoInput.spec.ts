import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TodoInput from '@/components/TodoInput.vue'

describe('TodoInput', () => {
  it('emits a trimmed title on submit', async () => {
    const wrapper = mount(TodoInput, {
      props: {
        maxLength: 160,
      },
    })

    await wrapper.get('input').setValue('  Buy milk  ')
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toEqual([['Buy milk']])
  })

  it('shows validation feedback for empty values', async () => {
    const wrapper = mount(TodoInput, {
      props: {
        maxLength: 160,
      },
    })

    await wrapper.get('input').setValue('   ')
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Please enter a todo title.')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})
