import React from 'react'
import { mount } from 'enzyme'
import { Greeting } from '../greeting'
import { sel, setupSandbox } from '../../shared/test_helpers'
import { findByText, reflush } from '../../shared/test_helpers_react'

describe('Greeting', () => {
  setupSandbox()

  const helloBtn = sel('dt-hello-btn')

  it('should work', () => {
    const w = mount(<Greeting />)
    helloBtn(w).simulate('click')
  })

  it('should provide the greeting', async () => {
    const w = mount(<Greeting />)

    await reflush(w)

    expect(w.text()).toEqual('Hello worldGreet me')

    findByText(/Greet/, w).simulate('click')
  })
})
