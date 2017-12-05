var webpack = require('webpack');
var path = require('path');

const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
  devServer: {
    historyApiFallback: true
  },
  // performance:{
  //   hints: 'warning',
  //   maxEntrypointSize: 100000, //bytes
  //   maxAssetSize: 450000,
  // },
  context: path.join(__dirname),
  entry: {
    app: "./src/js/root.js",
    vendor: ['react'],
  },
  output: {
    path: __dirname,
    filename: "[name].js"
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
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new BabiliPlugin()
  ],
}
