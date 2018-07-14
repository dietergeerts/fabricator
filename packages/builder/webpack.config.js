const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * @typedef {Object} FabricatorBuilderOptions
 */

/**
 * @return {Object}
 */
module.exports = () => {
  return ({
    entry: {
      index: path.resolve(__dirname, 'index.js'),
    },
    output: {
      filename: '[name].[chunkhash].js',
    },
    plugins: [
      new CleanWebpackPlugin(['dist'], { root: process.env.INIT_CWD }),
    ],
  });
};
