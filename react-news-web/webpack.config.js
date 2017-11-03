module.exports = {
  devServer: {
    historyApiFallback: true
  },
  entry: "./src/js/root.js",
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
      // ant.design样式的配置文件
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}
