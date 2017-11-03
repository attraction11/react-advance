import React from 'react'

// BodyIndex继承自React.Component类
// 这里的组件名BodyIndex,首字母必须大写
export default class BodyIndex extends React.Component {
  // 解析BodyIndex类的输出
  render() {
    // 定义变量
    let userName = '123';
    let boolInput = true;
    let html = 'IMOOC&nbsp;LESSON'
    // 组件的return函数返回的HTML节点必须是一个
    return (
      // JSX语法
      <div>
        <h1>这里是主体区域</h1>
        <p>{userName == '' ? '用户还没有登陆' : '用户名' + userName}</p>
        <p><input type='button' value={userName} disabled={boolInput}/></p>
        {/* 需要进行Unicode转码才可以被识别 */}
        <p>{html}</p>
        {/* 听说这个单词这么长，是故意的，应为有可能不合时宜的使用innerHTML会导致XSS攻击 */}
        <p dangerouslySetInnerHTML = {{__html : html}}></p>
      </div>
    )
  }

  componentWillMount () {
    // 定义的逻辑即可
    console.log('BodyIndex - componentWillMount');
  }
  
  componentDidMount () {
    console.log('BodyIndex - componentDidMount');
  }

}
