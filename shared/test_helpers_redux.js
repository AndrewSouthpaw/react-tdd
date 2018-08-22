import thunk from 'redux-thunk'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import { applyMiddleware, createStore } from 'redux'
import { append, last, reduce } from './ramda_loader'

const createReducer = () => {
  /* you should return your reducer here, or import it from wherever you build it in your code */
}

export const newMockStore = configureMockStore([thunk])
export const newMockStoreWithRealReducer = (state) => {
  const store = newMockStore(state)
  store.replaceReducer(createReducer())
  return store
}

export const rewire = (module, ...rewires) => {
  beforeAll(() => {
    rewires.forEach(r => module.__Rewire__(r[0], r[1]))
  })
  afterAll(() => {
    rewires.forEach(r => module.__ResetDependency__(r[0], r[1]))
  })
  afterEach(() => {
    // reset history of calls on the stub if a stub was passed in
    rewires.forEach((r) => { if (typeof r[1].resetHistory === 'function') r[1].resetHistory() })
  })

  return fromPairs(rewires)
}

/**
 * Useful for stubbing the dispatch prop passed into React components.
 */
export const DispatchStub = (promise = Promise.resolve()) => sinon.stub().returns(promise)

export const mockRedux = () => {
  const store = newMockStore({})
  return { store, dispatch: store.dispatch }
}

const ThunkStub = (type, promise = Promise.resolve()) => sinon.stub().returns(() => promise)

const ActionStub = (type) => sinon.stub().callsFake((...args) => ({ type: `${type}Stub`, args }))

/**
 * Returns an array of tuples, [label, stub], which mock thunks in actions. You can provide a spread of tuples with
 * the name of the thunk action (which should be the same as in the file under test), and optionally the promise
 * you want to return. Default is that it returns a resolved Promise.
 */
export const stubThunks = (...thunks) => thunks.map(([t, p]) => [t, ThunkStub(t, p)])

/**
 * Returns an array of tuples, [label, fn], which mock synchronous actions. These action stubs, when invoked, will
 * return an object with the label suffixed with 'type' and an array of args it was passed.
 */
export const stubActions = (...actions) => actions.map(type => [type, ActionStub(type)])

/**
 * Useful for reducer tests. Takes the initial state and any handlers, and then returns
 * a spread of the initial state and any intermediary states
 */
export const setupState = (initialState, ...actions) => (
  reduce(
    (acc, action) => append(action(last(acc)), acc),
    [initialState],
    actions,
  )
)
