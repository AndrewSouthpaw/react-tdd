import React from 'react'
import { TwitterFollowButton } from './twitter_follow_button'

export class NameBadge extends React.Component {
  state = {
    following: false,
  }

  addFollower = () => {
    this.setState({ following: !this.state.following })
  }

  render() {
    const { name, avatar } = this.props
    const { following } = this.state
    return (
      <div>
        <img src={avatar} />
        <p>
          {name}
          {following && ' (Following)'}
        </p>
        <TwitterFollowButton onFollow={this.addFollower} />
      </div>
    )
  }
}
