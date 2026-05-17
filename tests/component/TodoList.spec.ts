import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TodoList from '@/components/TodoList.vue'

const todos = [
  {
    id: 'todo-1',
    title: 'First todo',
    completed: false,
    createdAt: '2026-05-17T10:00:00.000Z',
    updatedAt: '2026-05-17T10:00:00.000Z',
  },
]

describe('TodoList', () => {
  it('renders todos and forwards toggle and remove actions', async () => {
    const wrapper = mount(TodoList, {
      props: {
        todos,
        maxLength: 160,
      },
    })

    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.get('.ghost-button').trigger('click')

    expect(wrapper.text()).toContain('First todo')
    expect(wrapper.emitted('toggle')).toEqual([['todo-1']])
    expect(wrapper.emitted('remove')).toEqual([['todo-1']])
  })

  it('forwards edit updates', async () => {
    const wrapper = mount(TodoList, {
      props: {
        todos,
        maxLength: 160,
      },
    })

    await wrapper.get('.secondary-button').trigger('click')
    await wrapper.get('input[type="text"]').setValue('Updated todo')
    await wrapper.get('.edit-actions .secondary-button').trigger('click')

    expect(wrapper.emitted('update')).toEqual([['todo-1', 'Updated todo']])
  })
})
