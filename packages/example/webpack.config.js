const webpackMerge = require('webpack-merge');
const WebpackStylish = require('webpack-stylish');
const fabricatorBuilderConfig = require('@fabricator/builder/webpack.config');

module.exports = () => webpackMerge(
  fabricatorBuilderConfig(),
  {
    plugins: [
      new WebpackStylish(),
    ],
  },
);
