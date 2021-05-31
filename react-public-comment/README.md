# react-simple-o2o-demo

升级 webpack3

- `npm uninstall babel-loader css-loader extract-text-webpack-plugin file-loader webpack webpack-dev-server --save-dev` 然后重新安装（可使用淘宝镜像`--registry=https://registry.npm.taobao.org`）
- 修改 `webpack.config.js` 和 `webpack.production.config.js`
- 增加 `postcss.config.js`
- package.json 
    - `"start": "NODE_ENV=dev webpack-dev-server --hot --open"`
    - `"build": "rm -rf ./build && NODE_ENV=production webpack -p --progress --config webpack.production.config.js"`
- app/components/Category/style.less 修改背景图片
- b/app/components/HomeAd/index.jsx 修改图片
- b/app/components/List/Item/index.jsx 修改图片


升级 React-router 4

- `npm uninstall react-router react-router-dom --save` 然后重新安装（可使用淘宝镜像`--registry=https://registry.npm.taobao.org`）
- 删除`app/router/routeMap.jsx`，增加`app/router/AppRouter.jsx` 和 `app/router/SubRouter.jsx`
- `react-router` 替换为 `react-router-dom`
- 所有的 `hashHistory.push` 改为 `this.props.history.push(backRouter)` ，并且把 `import { hashHistory } from 'react-router'` 删除
- app/page/City/index.jsx 将 `hashHistory.push` 修改为 `this.props.history.replace`
- 增加 `withRouter`
    - 所有 router 配置的，带`connect`的组件
    - `container/index.jsx`
- 将所有 `this.props.params` 修改为 `this.props.match.params`
- `<Header` `<HomeHeader` `<SearchHeader` 的引用增加 `history={this.props.history}`
