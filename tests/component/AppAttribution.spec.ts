import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AppAttribution from '@/components/AppAttribution.vue'

describe('AppAttribution', () => {
  it('renders the Arguslog attribution as a secure external link', () => {
    const wrapper = mount(AppAttribution)

    const link = wrapper.get('.app-attribution__link')

    expect(link.get('.app-attribution__eyebrow').text()).toBe('powered by')
    expect(link.get('.app-attribution__brand').text()).toBe('Arguslog.org')
    expect(link.attributes()).toMatchObject({
      href: 'https://arguslog.org',
      rel: 'noopener noreferrer',
      target: '_blank',
      'aria-label': 'powered by Arguslog.org (opens in a new tab)',
    })
  })

  it('keeps the brand label visually emphasized within the link', () => {
    const wrapper = mount(AppAttribution)

    expect(wrapper.get('.app-attribution__brand').text()).toBe('Arguslog.org')
    expect(wrapper.get('.app-attribution__eyebrow').text()).toBe('powered by')
  })
})
