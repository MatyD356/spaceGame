const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'script.js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(glb|gltf)$/,
        use:
          [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]'
              }
            }
          ]
      },
      {
        test: /\.(png|jp?g)$/,
        use:
          [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]'
              }
            }
          ]
      },
    ]
  },
  devServer: {
    clientLogLevel: 'silent',
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
  },

  plugins: [new HtmlWebpackPlugin()]
}