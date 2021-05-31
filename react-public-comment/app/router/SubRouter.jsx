import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import Home from '../page/Home'
import User from '../page/User'
import City from '../page/City'
import Login from '../page/Login'
import Search from '../page/Search'
import Detail from '../page/Detail'
import NotFound from '../page/404'

export default class SubRouter extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/city" component={City}/>
        <Route path="/login/:router?" component={Login}/>
        <Route path="/user" component={User}/>
        <Route path="/search/:category/:keyword?" component={Search}/>
        <Route path="/detail/:id" component={Detail}/>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}
