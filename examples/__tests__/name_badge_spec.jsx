import { NameBadge } from '../name_badge'
import { setupMount } from '../../shared/test_helpers_react'

const defaultProps = () => ({})

const wrap = setupMount(NameBadge, defaultProps)

describe('examples.name_badge', () => {
  it('should render', () => {
    const w = wrap()
    console.log(w.debug())
  })
})
