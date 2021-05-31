import React, {Component} from 'react'
import {Router, Route} from 'react-router-dom'

import App from '../page'
import SubRouter from './SubRouter'

import { createBrowserHistory as createHistory } from 'history'
const customHistory = createHistory()

export default class AppRouter extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Router history={customHistory}>
        <App>
          <Route path="/" component={SubRouter} />
        </App>
      </Router>
    )
  }
}
