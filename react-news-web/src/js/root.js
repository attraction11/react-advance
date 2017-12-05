import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter,Switch } from 'react-router-dom';
// 单个组件的导入（按需加载）
import Button from 'antd/lib/button'
import 'antd/dist/antd.css'
import MediaQuery from 'react-responsive'
import PCIndex from './components/pc_index'
import MobileIndex from './components/mobile_index'
import PCNewsDetails from './components/pc_news_details'
import MobileNewsDetails from './components/mobile_news_details'
import PCUserCenter from './components/pc_usercenter'
import MobileUserCenter from './components/mobile_usercenter'

export default class Root extends React.Component {
  render() {
    return (
      <div>
        <MediaQuery query="(min-device-width: 1224px)">
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={PCIndex}></Route>
              <Route path="/details/:uniquekey" component={PCNewsDetails}></Route>
              <Route path="/usercenter/" component={PCUserCenter}></Route>
            </Switch>
          </BrowserRouter>
        </MediaQuery>
        <MediaQuery query="(max-device-width: 1224px)">
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={MobileIndex}></Route>
              <Route path="/details/:uniquekey" component={MobileNewsDetails}></Route>
              <Route path="/usercenter/" component={MobileUserCenter}></Route>
            </Switch>
          </BrowserRouter>
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
