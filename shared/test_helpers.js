import axios from 'axios'
import { curry, union, keys, reduce, equals, assoc } from './ramda_loader'
import sinon from 'sinon'

let id = 0

export const nextId = () => id++

export const noop = (...args) => {}

/**
 * Passes through the function. Useful for connector functions.
 */
export function passThrough(a) { return a }

/**
 * Allows you to select a node by its `data-test-id` attribute. Example usage:
 *
 *    const myButton = sel('my-button', w)
 *
 * It is curried so you can create a higher order named selector for convenience:
 *
 *    const myButton = sel('my-button')
 *    expect(myButton(w).text()).toEqual('I am a button')
 *    myButton(w).simulate('click')
 *    // ... etc.
 */
export const sel = curry((dataTestId, wrapper) => wrapper.find(`[data-test-id="${dataTestId}"]`))

/**
 * Takes the difference between two objects. Does not accommodate deep diffing.
 */
export const diff = (lhs, rhs) => {
  const ks = union(keys(lhs), keys(rhs))
  return reduce(
    (acc, k) => (equals(lhs[k], rhs[k]) ? acc : assoc(k, rhs[k], acc)),
    {},
    ks,
  )
}

/**
 * Convenience function. Takes a cb which contains setup for the sandbox, and does the appropriate setup
 * for the beforeEach and afterEach blocks.
 */
export const setupSandbox = (cb) => {
  global.sandbox = sinon.createSandbox()

  beforeEach(() => {
    // always stub the server just in case
    serverReturnsSuccess()
    if (cb) cb(global.sandbox)
  })

  afterEach(() => {
    global.sandbox.restore()
  })
}

const serverReturns = (promise) => {
  if (axios.get.restore) {
    axios.get.restore()
    axios.post.restore()
    axios.put.restore()
    axios.delete.restore()
  }

  global.sandbox.stub(axios, 'get').returns(promise)
  global.sandbox.stub(axios, 'post').returns(promise)
  global.sandbox.stub(axios, 'put').returns(promise)
  global.sandbox.stub(axios, 'delete').returns(promise)
}

/**
 * Helper functions to set up a mock server response. Returns the object passed in so you can store it
 * inline and write expectations about it.
 */
export const serverReturnsSuccess = (data) => { // eslint-disable-line arrow-parens
  serverReturns(Promise.resolve({ data }))
  return data
}

export const serverReturnsFailure = (data) => { // eslint-disable-line arrow-parens
  serverReturns(Promise.reject({ response: { data } }))
  return data
}

export const serverReturnsNetworkError = () => {
  serverReturns(Promise.reject({ message: 'Network Error' }))
}

export const resetApiHistory = () => {
  axios.get.resetHistory()
  axios.post.resetHistory()
  axios.put.resetHistory()
  axios.delete.resetHistory()
}

/**
 * From: https://github.com/facebook/jest/issues/2157#issuecomment-279171856
 */
export const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

export const collect = (...vals) => [vals, ...vals]

export const sleep = async timeInMs => new Promise(res => setTimeout(res, timeInMs))
