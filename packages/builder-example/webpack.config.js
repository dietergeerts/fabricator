const fabricatorBuilderCoreConfig = require('@fabricator/builder-core/webpack.config');
const fabricatorBuilderThemeDefaultConfig = require('@fabricator/builder-theme-default/webpack.config');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// When using html to write your docs/previews, these loaders can be used,
// to gather the html, extract, save as file and return the file location.
const docsAndPreviewsAsHtml = {
  test: /\.(docs|preview)\.html$/,
  use: [
    { loader: 'file-loader' },
    { loader: 'extract-loader' },
    {
      loader: 'html-loader',
      options: {
        attrs: [
          'iframe:src',
        ],
      },
    },
  ],
};

module.exports = webpackMerge(
  fabricatorBuilderCoreConfig,
  fabricatorBuilderThemeDefaultConfig,
  {
    module: {
      rules: [
        docsAndPreviewsAsHtml,
      ],
    },
    plugins: [
      new HtmlWebpackPlugin(),
    ],
  },
);
