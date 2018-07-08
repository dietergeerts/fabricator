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
                  'link:href',
                  'script:src',
                ],
              },
            },
            // To enable the use of user defined templates, it may be better to
            // use the complex loader and one to load the template based on the
            // given path, so that the template is also included as dependency.
            // TODO: load template based on filename, for dependency inclusion.
            // The complex loader can also be used to require assets like styles
            // that then can be injected into the template....
            {
              loader: 'fb-wrapper-loader',
              options: {
                template: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><%= title %></title>
  <link href="<%= styleDocs %>" rel="stylesheet">
  <link href="<%= styleDocsContainer %>" rel="stylesheet">
  <link href="<%= styleCode %>" rel="stylesheet">
</head>
<body class="markdown-body">
<%= content %>
</body>
</html>
`,
                data: {
                  title: `${options.sourcePackage.name} v${options.sourcePackage.version}`,
                  // For now, I use the markdown styling, as that was the easiest to find,
                  // and it's used for the same purpose as a toolkit: documentation.
                  // Notice the `markdown-body` class, which is needed for the github css.
                  // TODO: Make sure this is gotten in another way and embedded into a real theme.
                  styleDocs: path.resolve(__dirname, 'node_modules/github-markdown-css/github-markdown.css'),
                  styleDocsContainer: path.resolve(__dirname, './theme/docs.css'),
                  styleCode: path.resolve(__dirname, 'node_modules/highlight.js/styles/github-gist.css'),
                },
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
        // We include stylesheets as part of the default theme, in order to
        // have some nice looking UI and documentation pages with code blocks.
        // We define these inside the html templates being used, so we can
        // just extract them with the file loader and be done.
        {
          test: /\.css$/,
          include: path.resolve(__dirname),
          use: [
            { loader: 'fb-file-loader' },
            // { loader: 'fb-css-loader' },
            // TODO: Figure out how to combine css with file loader.
            // For the moment, we use plain css files, so actually, there is no
            // need to use the css loader here, though it may be useful later.
          ],
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
          'css-loader',
          'debug-loader',
          'extract-loader',
          'file-loader',
          'html-loader',
          'markdown-it-loader',
          'spawn-loader',
          'vue-loader',
          'wrapper-loader',
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
