import React from 'react'

// ComponentHeader继承自React.Component类
// 这里的组件名ComponentHeader,首字母必须大写
export default class ComponentHeader extends React.Component {
  // 解析ComponentHeader类的输出
  render() {
    // 组件的return函数返回的HTML节点必须是一个
    return (
      // JSX语法
      <header>
        <h1>这里是头部!!!!!</h1>
      </header>
    )
  }
}
