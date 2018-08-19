const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const LOG_PREFIX = '[fabricator-builder]';

/**
 * @typedef {Object} FabricatorBuilderOptions
 * @property {RegExp} docsTest
 */

/**
 * @param {FabricatorBuilderOptions} options
 * @param {Object} webpackConfig
 * @return {Object}
 */
module.exports = (options, webpackConfig) => {
  if (!options.docsTest) {
    throw new Error(
      `${LOG_PREFIX} the \`docsTest\` option has to be set.`
      + ` We need this to require your documentation files.`,
    );
  }

  if (!webpackConfig.context) {
    throw new Error(
      `${LOG_PREFIX} the webpack \`context\` option has to be set.`
      + ` We need this as context to require your documentation files.`,
    );
  }

  return webpackMerge(
    webpackConfig,
    {
      entry: {
        index: path.resolve(__dirname, 'src/index.js'),
      },
      output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(process.env.INIT_CWD, 'dist'),
      },
      module: {
        rules: [
          {
            test: options.docsTest,
            include: webpackConfig.context,
            use: [
              'file-loader?name=[name].[hash].html',
            ],
          },
        ],
      },
      plugins: [
        new CleanWebpackPlugin(['dist'], { root: process.env.INIT_CWD }),
        new webpack.DefinePlugin({
          __TOOLKIT_SRC__: JSON.stringify(webpackConfig.context),
          __TOOLKIT_DOCS__: options.docsTest,
        }),
        new HtmlWebpackPlugin(),
      ],
    },
  );
};
