import React from 'react'
import { flushPromises } from './test_helpers'

/**
 * Simulates a click on the Enzyme wrapper and provides along useful stubs for common SyntheticEvent
 * props, e.g. stopPropagation.
 */
export const simulateClick = (wrapper, data) => (
  wrapper.simulate('click', { stopPropagation: sinon.stub(), ...data })
)

// Simulates a change event like those triggered by input DOM elements
export const simulateChange = (wrapper, value) => (
  wrapper.simulate('change', { target: { value } })
)

export const simulatePress = (wrapper, data) => {
  const { onPress } = wrapper.props()
  if (onPress) {
    onPress(data)
  } else {
    try {
      simulatePress(wrapper.parent(), data)
    } catch (e) {
      throw new Error('Could not find any elements with onPress property!')
    }
  }
}

/**
 * Mocks a React component, useful when you're doing `mount` (for refs, lifecycle testing, etc.) and don't want to
 * actually mount some components.
 */
export const mockComponent = (componentName, methods) => (
  createReactClass(({
    displayName: componentName,
    render: () => null,
    ...methods,
  }))
)

export const reflush = async (wrapper) => {
  await flushPromises()
  wrapper.update()
}

/**
 * Workaround for broken `findWhere` behavior for mounted components when searching by text
 * https://github.com/airbnb/enzyme/issues/1566
 */
const textContent = (node) => {
  try {
    // enzyme sometimes blows up on text()
    return node.text()
  } catch (_e) {
    return ''
  }
}

// useful for finding a node by its text
export const findByText = (text, wrapper, options = {}) => {
  const comparator = options.exact ? x => textContent(x) === text : x => new RegExp(text).test(textContent(x))
  return wrapper.findWhere(comparator).last()
}

// get the text of all nodes in the tree
export const textList = (wrapper) => wrapper.map(x => x.text())

// check if any part of the tree contains a class name. Expects 'foo' instead of '.foo'
export const containsClass = (className, wrapper) => {
  if (typeof className === 'string') {
    return wrapper.map(node => node.hasClass(className)).some(x => x) || (
      wrapper.children().exists()
        ? wrapper.children().map(node => containsClass(className, node)).some(x => x)
        : false
    )
  } else {
    const cn = className // flow type refinement
    return wrapper.map(node => cn.test(node.props().className)).some(x => x)
  }
}

// Special data must be passed to Link component to correctly simulate navigation to link. ¯\_(ツ)_/¯
// https://github.com/airbnb/enzyme/issues/516
export const navigateLink = (wrapper, data) => simulateClick(wrapper, { button: 0, ...data })
