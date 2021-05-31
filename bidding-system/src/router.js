import React from 'react';
import { Route, Switch,HashRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import index from './pages/index/index.js';
import packageManage from './pages/packageManage/index.js';
import packageManageErrorListDetails from './pages/newImportErrorListPage/newErrorListPage.js';
import bidTrack from './pages/bidTrack/index.js';
import resultQuery from './pages/resultQuery/resultQuery.js';
import clientManage from './pages/clientManage/index.js';
import clientManageErrorListDetails from './pages/newImportErrorListPage/newErrorListPage.js';
import onlineList from './pages/onlineList/index.js';
import onlineInfo from './pages/onlineList/info.js';
import bidRecord from './pages/bidRecord/index.js';
import agreementView from './pages/agreement/view';
import guide from './pages/guide/index';
import login from './pages/login/login';
import NotFoundPage from './pages/404/404.js';
import Help from './pages/help/index.js';
function RouterConfig({ history, app }) {
  return (
      <LocaleProvider locale={zhCN}>
        <HashRouter>
          <Switch>
              <Route path="/login" exact component={login} />
              <Route path="/" exact component={index} />
              <Route path="/packageManage" exact component={packageManage} />
              <Route path="/packageManage/errorListDetails" exact component={packageManageErrorListDetails} />
              <Route path="/bidTrack" exact component={bidTrack} />
              <Route path="/resultQuery" exact component={resultQuery} />
              <Route path="/clientManage" exact component={clientManage} />
              <Route path="/clientManage/errorListDetails" exact component={clientManageErrorListDetails} />
              <Route path="/onlineList" exact component={onlineList} />
              <Route path="/onlineList/info" exact component={onlineInfo} />
              <Route path="/bidRecord" exact component={bidRecord} />
              <Route path="/agreementView" exact component={agreementView} />
              <Route path="/guide" exact component={guide} />
              <Route path="/help*" exact component={Help} />
              <Route path="*" component={NotFoundPage} />
          </Switch>
        </HashRouter>
      </LocaleProvider>
  );
}

export default RouterConfig;
