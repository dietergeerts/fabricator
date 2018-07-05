const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const LOG_PREFIX = '[fabricator-builder]';

/**
 * @typedef {Object} FabricatorBuilderOptions
 * @property {string} sourcePackage - Package JSON, to extract name, version, ...
 * @property {string} sourceDirectory - Absolute path to toolkit source directory
 */

/**
 * @param {FabricatorBuilderOptions} options
 * @returns {Object}
 */
module.exports = options => {
  if (!options.sourcePackage) {
    throw new Error(
      `${LOG_PREFIX} the \`sourcePackage\` option is not set.`
      + ` We need this to extract info like name and version.`,
    );
  }

  if (!path.isAbsolute(options.sourceDirectory)) {
    throw new Error(
      `${LOG_PREFIX} the \`sourceDirectory\` option needs to be an absolute path.`
      + ` \`${options.sourceDirectory}\` was given.`,
    );
  }

  return {
    entry: path.resolve(__dirname, './index.js'),
    module: {
      rules: [
        {
          test: /\.docs\.md$/,
          include: options.sourceDirectory,
          use: [
            {
              loader: 'fb-file-loader',
              options: {
                name: '[path][name].[hash].html',
              },
            },
            { loader: 'fb-extract-loader' },
            { loader: 'fb-html-loader' },
            { loader: 'fb-markdown-it-loader' },
          ],
        },
      ],
    },
    resolveLoader: {
      // To make sure loaders aren't mixed from this package and the consumer package,
      // we'll have to use aliasing, and redirect these to our `node_modules` instead.
      alias: [
        'extract-loader',
        'file-loader',
        'html-loader',
        'markdown-it-loader',
      ].reduce((alias, loader) => {
        alias[`fb-${loader}`] = path.resolve(__dirname, `node_modules/${loader}`);
        return alias;
      }, {}),
    },
    plugins: [
      new webpack.DefinePlugin({
        __TOOLKIT_PKG__: JSON.stringify(options.sourcePackage),
        __TOOLKIT_SRC__: JSON.stringify(options.sourceDirectory),
      }),
      new HtmlWebpackPlugin(),
    ],
  };
};
