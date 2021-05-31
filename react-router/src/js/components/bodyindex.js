import React from 'react'
import ReactDom from 'react-dom'
import { Input } from 'antd'
// ES6下使用mixin,安装的插件
import ReactMixin from 'react-mixin'
import BodyChild from './bodychild'
import MixinLog from './mixins'

// 定义组件属性默认值
const defaultProps = {
  username: '这是一个默认值'
}

// BodyIndex继承自React.Component类
// 这里的组件名BodyIndex,首字母必须大写
export default class BodyIndex extends React.Component {
  constructor() {
    // 调用基类的所有的初始化方法
    super();
    // 初始化赋值
    this.state = {
      username: 'parry',
      age: '20'
    }
  }

  changeUserInfo(age) {
    this.setState({
      age: age
    })
    // 操作DOM的第一种方法
    // const mySubmitBotton = document.getElementById('submitBotton')
    // console.log(mySubmitBotton)
    // ReactDom.findDOMNode(mySubmitBotton).style.color = 'red'

    // 操作DOM的第二种方法(推荐使用)
    console.log(this.refs.submitBotton)
    this.refs.submitBotton.style.color = 'red'

    // console.log('abcdefg...')
    MixinLog.log();
  }

  handleChildValueChange(event) {
    this.setState({
      age: event.target.value
    })
  }

  // 解析BodyIndex类的输出
  render() {
    // setTimeout(() => {
    //   // 更改state
    //   this.setState({
    //     username: 'IMOOC',
    //     age: '30'
    //   })
    // }, 4000);

    return (
      // JSX语法
      <div>
        <h1>这里是主体区域</h1>
        <p>接收到父页面的属性：userid: {this.props.userId} username: {this.props.username}</p>
        <p>age: {this.state.age}</p>
        <Input />
        {/* 使用ES6的语法需要bind(this)，否则需要对this进行一定的初始化*/}
        <Input id="submitBotton" ref="submitBotton" type="button" value="提交" onClick = {this.changeUserInfo.bind(this, 99)} />
        <BodyChild {...this.props} id="4" handleChildValueChange= {this.handleChildValueChange.bind(this)} />
      </div>
    )
  }
}

// 定义组件属性的数据格式
BodyIndex.propTypes = {
  userId: React.PropTypes.number.isRequired
}

// 赋值组件属性的默认值
BodyIndex.defaultProps = defaultProps

//
ReactMixin(BodyIndex.prototype, MixinLog)
