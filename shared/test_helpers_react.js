import React from 'react'
import { mount } from 'enzyme'
import { flushPromises } from './test_helpers'

/**
 * The FakeProvider allows you to pass props into your enzyme wrapper through `.setProps()` for a
 * component that is redux-connected and have those props appear in the actual component that you're
 * interested in; it passes its props to the child that it wraps. Without it, actions done with
 * `wrapper.setProps()` will not correctly pass along the props to the component that you're testing.
 */
class FakeReduxProvider extends React.Component {
  render() {
    const { children, store, ...rest } = this.props // eslint-disable-line react/prop-types
    return (
      <Provider store={store}>
        {React.cloneElement(children, { ...rest })}
      </Provider>
    )
  }
}

/**
 * Convenience wrapper to mount a component.
 */
export const setupMount = (Component, defaultProps) => (props = {}) => (
  mount(<Component {...defaultProps()} {...props} />)
)

/**
 * Convenience wrapper to mount a Redux-connected component.
 */
export const setupMountReduxComponent = (Component, defaultProps) => (store, props = {}) => (
  mount(
    <FakeReduxProvider store={store}>
      <Component {...defaultProps()} {...props} />
    </FakeReduxProvider>,
  )
)

/**
 * Simulates a click on the Enzyme wrapper and provides along useful stubs for common SyntheticEvent
 * props, e.g. stopPropagation.
 */
export const simulateClick = (wrapper, data) => (
  wrapper.simulate('click', { stopPropagation: sinon.stub(), ...data })
)

/**
 * Simulates a change event like those triggered by input DOM elements
 */
export const simulateChange = (wrapper, value) => (
  wrapper.simulate('change', { target: { value } })
)

/**
 * Simulates a press for react native tests. There is no built-in support for press events, so the system is hacked
 * by simply walking up the tree until a component with an `onPress` property is found. Not the best, but better
 * than nothing.
 */
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

/**
 * Helper function
 * @param wrapper
 * @returns {Promise<void>}
 */
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
