const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const markdownItCustomBlock = require('markdown-it-custom-block');

const LOG_PREFIX = '[fabricator-builder]';

// TODO: Check if we can move some peerDependencies to our own dependencies,
// so we can have different versions of loaders. We need to take into account
// that npm can install a module in our own node_modules or in the parent
// node_modules directory, so an absolute path will not always work!!!

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
    entry: path.resolve(__dirname, 'index.js'),
    module: {
      rules: [
        // Main entry points for the documentation pages, written in markdown.
        // We'll add several features to make writing docs in MD easy, like the
        // possibility to require other docs files, to enable auto-generation.
        {
          test: /\.docs\.md$/,
          include: options.sourceDirectory,
          use: [
            'file-loader?name=[name].[hash].html',
            'extract-loader',
            {
              loader: 'html-loader',
              options: {
                attrs: [
                  'link:href',
                  'script:src',
                  'iframe:src',
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
              loader: 'wrapper-loader',
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
                  styleDocs: '~github-markdown-css/github-markdown.css',
                  styleDocsContainer: path.resolve(__dirname, 'theme/docs.css'),
                  styleCode: '~highlight.js/styles/github-gist.css',
                },
              },
            },
            {
              loader: 'markdown-it-loader',
              options: {
                use: [
                  [markdownItCustomBlock, {
                    'require': src => `<script src="${src}?forRequire"></script>`,
                    'preview': src => `<iframe src="${src}?forPreview" width="100%" height="300px"></iframe>`,
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
        // Feature to enable Vue docs/previews injection into the markdown docs.
        // Example use-case: auto-generate docs based on f.e. sassdocs, using
        // previews with the source assets, ....
        {
          test: /\.vue$/,
          include: options.sourceDirectory,
          oneOf: [
            {
              resourceQuery: /forPreview/,
              use: [
                'file-loader?name=[name].[hash].html',
                'extract-loader',
                'html-loader?attrs=script:src',
                'html-preview-vue-loader',
              ],
            },
            {
              resourceQuery: /forRequire/,
              use: [
                'spawn-loader?name=[name].[chunkhash].js',
                'html-inject-vue-loader',
              ],
            },
            // This is a workaround to load the `(docs|preview).vue` files, as using
            // the remainingRequest inside the pitch phase doesn't work for now.
            // TODO: Create reproduction sample: https://github.com/vuejs/vue-loader/issues/1355
            {
              resourceQuery: /forInjection/,
              loader: 'vue-loader',
            },
            // Because the way the vue loader works, it's impossible to have separate rules in this
            // builder and in the users' project. So we'll NEED to define vue, and it's loaders as
            // peer dependencies, and let the user know the rules for vue will be defined here.
            // Which imho isn't good, as rules for the resources of the user should be defined in
            // the actual toolkit! (same applies to the runtime alias, as the user will use it too!)
            // TODO: Document about the fact that an alias is needed for vue not be the runtime version.
            {
              loader: 'vue-loader',
            },
          ],
        },
        // We include stylesheets as part of the default theme, in order to
        // have some nice looking UI and documentation pages with code blocks.
        // We define these inside the html templates being used, so we can
        // just extract them with the file loader and be done.
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, 'theme'),
            /node_modules(\\|\/)highlight.js/,
            /node_modules(\\|\/)github-markdown-css/,
          ],
          issuer: /\.docs\.md$/,
          use: [
            { loader: 'file-loader' },
            // { loader: 'css-loader' },
            // TODO: Figure out how to combine css with file loader.
            // For the moment, we use plain css files, so actually, there is no
            // need to use the css loader here, though it may be useful later.
          ],
        },
      ],
    },
    resolveLoader: {
      // We also create custom loaders for things we can't find loaders for.
      // In the future, we can extract these and add unit tests and publish.
      alias: [
        'html-inject-vue-loader',
        'html-preview-vue-loader',
      ].reduce((alias, loader) => {
        alias[loader] = path.resolve(__dirname, `loaders/${loader}`);
        return alias;
      }, {}),
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
