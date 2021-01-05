const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'script.js'
  },
  devServer: {
    clientLogLevel: 'silent',
    contentBase: './dist',
    hot: true,
  },

  plugins: [new HtmlWebpackPlugin()]
}