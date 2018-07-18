import React from 'react'
import { mount } from 'enzyme'
import { Greeting } from '../greeting'

describe('Greeting', () => {
  it('should work', () => {
    const w = mount(<Greeting />)
    expect(w.text()).toEqual('Hello world')
  })
})
