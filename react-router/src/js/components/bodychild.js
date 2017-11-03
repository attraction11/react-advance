import React from 'react'
import { Input } from 'antd'

export default class BodyChild extends React.Component {
  render() {
    return (
      <div>
        <p>子页面输入：<Input type="text" onChange={this.props.handleChildValueChange} /></p>
        <p>userid: {this.props.userId} username: {this.props.username} id: {this.props.id}</p>
      </div>
    )
  }
}
