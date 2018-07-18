import axios from 'axios'
import { curry } from './ramda_loader'
import sinon from 'sinon'

let id = 0

export const nextId = () => id++

export const noop = (...args) => {}

/**
 * Passes through the function. Useful for connector functions.
 */
export function passThrough(a) { return a }

export const sel = curry((dataTestId, wrapper) => wrapper.find(`[data-test="${dataTestId}"]`))

/**
 * Expects the two objects only differ by the keys specified, and returns those keys in an object for further
 * inspection.
 */
export const onlyDiff = (lhs, rhs, ...keys) => {
  expect(omit(keys, lhs)).toEqual(omit(keys, rhs))
  return pickAll(keys, rhs)
}

/**
 * Convenience function. Takes a cb which contains setup for the sandbox, and does the appropriate setup with Mocha
 * for the beforeEach and afterEach blocks.
 */
export const setupSandbox = (cb) => {
  global.sandbox = sinon.sandbox.create()

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
 * Helper functions to set up a mock server call. Returns the object passed in so you can store it
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

/**
 * From: https://github.com/facebook/jest/issues/2157#issuecomment-279171856
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve))

export const collect = (...vals) => [vals, ...vals]

export const sleep = async timeInMs => new Promise(res => setTimeout(res, timeInMs))
