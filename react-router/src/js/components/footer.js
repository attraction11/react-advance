import React from 'react'
const footerCss = require('../../css/footer.css')

// ComponentFooter继承自React.Component类
// 这里的组件名ComponentFooter,首字母必须大写
export default class ComponentFooter extends React.Component {
  // 解析ComponentFooter类的输出
  render() {
    // 组件的return函数返回的HTML节点必须是一个
    return (
      <footer>
        <h1>这里是底部</h1>
      </footer>
    )
  }
}
