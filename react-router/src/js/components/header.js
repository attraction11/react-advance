import React from 'react'
import { Link } from 'react-router-dom'

// ComponentHeader继承自React.Component类
// 这里的组件名ComponentHeader,首字母必须大写
export default class ComponentHeader extends React.Component {

  constructor() {
    // super()是继承了整个类的一个引用
    super();
    this.state = {
      // 默认加载的时候高不是miniHeader
      miniHeader: false
    }
  }

  switchHeader() {
    this.setState({
      miniHeader: !this.state.miniHeader
    })
  }

  // 解析ComponentHeader类的输出
  render() {
    // 组件的return函数返回的HTML节点必须是一个
    return (
      // JSX语法
      <header
        class="smallFontSize">
        <h1>这里是头部!!</h1>
        <ul>
          <li><Link to={`/`}>首页</Link></li>
					<li><Link to={`/detail`}>嵌套的详情页面</Link></li>
					<li><Link to={`/list/22222`}>列表页面</Link></li>
        </ul>
      </header>
    )
  }
}
