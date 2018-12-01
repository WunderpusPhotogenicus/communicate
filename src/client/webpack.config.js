const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, "index.js"),
  output:{
    filename:'bundle.js',
    path:path.join(__dirname,"/dist/")
  },
  devServer:{
    publicPath:'http://localhost:8080/',
    compress:true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          plugins: ['@babel/plugin-proposal-class-properties']
        },
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
        exclude: /node_modules/
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        query: {
          plugins: ['@babel/plugin-proposal-class-properties']
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg)$/,
        use: [{ loader: "url-loader?limit=8192" }],
        exclude: /node_modules/
      }
    ]
  },
  performance: {
    hints: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html"
    }),
  ],

}