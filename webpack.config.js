const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/FullMoon.ts',
  mode: 'production',
  module: {
    noParse: /browserfs\.js/,
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      'fs': 'browserfs/dist/shims/fs.js',
    }
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static' },
        { from: 'node_modules/browser-fasttext.js/fasttext_wasm.wasm'}
      ]
    })
  ],
  output: {
    filename: 'fullmoon.js',
    path: path.resolve(__dirname, 'dist'),
  },
};