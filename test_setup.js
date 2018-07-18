// setup file
import util from 'util'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { last } from './shared/ramda_loader'

configure({ adapter: new Adapter() })

/**
 * spit out to console and return value passed in
 * if 2 args passed in, print both, return 2nd
 */
global.spit = (...args) => {
  console.log(...args.map(arg => util.inspect(arg, { showHidden: false, depth: null })))
  return last(args)
}
