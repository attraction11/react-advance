import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import 'antd/dist/antd.css'
import MediaQuery from 'react-responsive'
import PCIndex from './components/pc_index'
import MobileIndex from './components/mobile_index'

export default class Root extends React.Component {
  render() {
    return (
      <div>
        <MediaQuery query="(min-device-width: 1224px)">
          <PCIndex/>
        </MediaQuery>
        <MediaQuery query="(max-device-width: 1224px)">
          <MobileIndex/>
        </MediaQuery>
      </div>
    )
  }
}

// 入口的定义(组件名 + 绑定DIV的ID)
ReactDOM.render (
	<Root/>, 
	document.getElementById('mainContainer')
);
