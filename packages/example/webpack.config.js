const webpackMerge = require('webpack-merge');
const fabricatorBuilderConfig = require('@fabricator/builder/webpack.config');

module.exports = webpackMerge(
  fabricatorBuilderConfig,
  {},
);
