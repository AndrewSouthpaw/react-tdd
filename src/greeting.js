import React from 'react'
import axios from 'axios'

export class MyButton extends React.Component {
  render() {
    return <button onClick={this.props.onClickButton}>{this.props.text}</button>
  }
}

export class Greeting extends React.Component {
  constructor(props) {
    super(props)
    this.state = { greeting: '' }
  }

  async componentDidMount() {
    // console.log('axios.get', axios.get)
    // const res = await axios.get('/greeting').data
    const res = await new Promise((resolve) => {
      setImmediate(() => { resolve('Hello world') })
    })
    this.setState({ greeting: res })
  }

  render() {
    const { greeting } = this.state
    return (
      <div>
        <p>{greeting}</p>
        <MyButton
          onClickButton={() => {
            console.log(greeting)
          }}
          data-test="dt-hello-btn"
          text="Greet me"
        />
        <MyButton onClickButton={() => { console.log('goodbye') }} />
      </div>
    )
  }
}
