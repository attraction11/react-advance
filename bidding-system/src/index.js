import React from 'react';
import ReactDOM from 'react-dom';
import Route from './router';
import {Provider} from 'react-redux';
//import { message } from 'antd';
import { AppContainer } from 'react-hot-loader';
import store from './store/store';
ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
          <Route />
      </AppContainer>
    </Provider>,
  document.getElementById('root'));

