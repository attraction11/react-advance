module.exports = {
  entry: "./src/js/index.js",
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/src/"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        include: __dirname,
        query: {
          presets: [ "es2015", "react" ],
          // 添加组件的插件配置
          plugins: [ "react-html-attrs" ]
        }
      },
      //下面是添加的 css 的 loader，也即是 css 模块化的配置方法，大家可以拷贝过去直接使用
      // {
      //   test: /\.css$/,
      //   loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      // }
      // ant.design样式的配置文件
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}
