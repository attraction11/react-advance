import React from 'react'

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
    // 在render函数内定义内联样式的方式
    // 缺点：动画、伪类样式不能使用
    const styleComponentHeader = {
      header: {
        backgroundColor: "#333",
        color: "#fff",
        //注意：这里需要采用()的方式
        paddingTop: (this.state.miniHeader) ? "3px" : "15px",
        paddingBottom: (this.state.miniHeader) ? "3px" : "15px"
      }
      // 这里还可以定义其他的样式
    }
    // 组件的return函数返回的HTML节点必须是一个
    return (
      // JSX语法
      <header
        style={styleComponentHeader.header}
        class="smallFontSize"
        onClick={this.switchHeader.bind(this)}>
        <h1>这里是头部!!!!!</h1>
      </header>
    )
  }
}
