import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import Index from './index'
import ComponentList from './components/list'

export default class Root extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
        	<Route exact path="/" component={Index}>
          </Route>
        	<Route path="/list/:id" component={ComponentList} />
        </Switch>
			</BrowserRouter>
    )
  }
}

// 入口的定义(组件名 + 绑定DIV的ID)
ReactDOM.render (
	<Root/>,
	document.getElementById('example')
);
