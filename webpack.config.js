const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const markdownItCustomBlock = require('markdown-it-custom-block');

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
        // Main entry points for the documentation pages, written in markdown.
        // We'll add several features to make writing docs in MD easy, like the
        // possibility to require other docs files, to enable auto-generation.
        {
          test: /\.docs\.md$/,
          include: options.sourceDirectory,
          use: [
            {
              loader: 'fb-file-loader',
              options: {
                name: '[name].[hash].html',
              },
            },
            { loader: 'fb-extract-loader' },
            {
              loader: 'fb-html-loader',
              options: {
                attrs: [
                  'script:src',
                ],
              },
            },
            {
              loader: 'fb-markdown-it-loader',
              options: {
                use: [
                  [markdownItCustomBlock, {
                    'require': src => `<script src="${src}"></script>`,
                  }],
                ],
              },
            },
          ],
        },
        // We need to fool the VueLoaderPlugin, as that checks if a rule is available
        // for vue components, but it can't see our more restricted one....
        // It even checks the name of the loader, so aliasing also doesn't work.
        {
          test: /\.vue$/,
          include: path.resolve(__dirname),
          loader: 'vue-loader',
        },
        // Feature to enable Vue docs injection into the markdown ones.
        // Example use-case: auto-generate color maps based on sass-docs.
        {
          test: /\.docs\.vue$/,
          include: options.sourceDirectory,
          issuer: /\.docs\.md$/,
          use: [
            {
              loader: 'fb-spawn-loader',
              options: {
                name: '[name].[chunkhash].js',
              },
            },
            { loader: 'fb-html-inject-vue-loader' },
            // { loader: 'fb-vue-loader' },
          ],
        },
        // This is a workaround to load the `docs.vue` files, as using the
        // remainingRequest inside the pitch phase doesn't work for now.
        // TODO: Create reproduction sample: https://github.com/vuejs/vue-loader/issues/1355
        {
          test: /\.docs\.vue$/,
          include: options.sourceDirectory,
          issuer: /\.docs\.vue$/,
          loader: 'fb-vue-loader',
        },
      ],
    },
    resolve: {
      alias: {
        // Vue uses the runtime version by default, which we don't want.
        'fb-vue': path.resolve(__dirname, 'node_modules/vue/dist/vue'),
      },
    },
    resolveLoader: {
      alias: Object.assign(
        // To make sure loaders aren't mixed from this and the consumer package
        // we'll have to use aliasing, and redirect these to our `node_modules`.
        [
          'debug-loader',
          'extract-loader',
          'file-loader',
          'html-loader',
          'markdown-it-loader',
          'spawn-loader',
          'vue-loader',
        ].reduce((alias, loader) => {
          alias[`fb-${loader}`] = path.resolve(__dirname, `node_modules/${loader}`);
          return alias;
        }, {}),
        // We also create custom loaders for things we can't find loaders for.
        // In the future, we can extract these and add unit tests and publish.
        [
          'html-inject-vue-loader',
        ].reduce((alias, loader) => {
          alias[`fb-${loader}`] = path.resolve(__dirname, `./loaders/${loader}`);
          return alias;
        }, {}),
      ),
    },
    plugins: [
      new webpack.DefinePlugin({
        __TOOLKIT_PKG__: JSON.stringify(options.sourcePackage),
        __TOOLKIT_SRC__: JSON.stringify(options.sourceDirectory),
      }),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin(),
    ],
  };
};
