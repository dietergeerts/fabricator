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

module.exports = {
  module: {
    rules: [
      docsAndPreviewsAsHtml,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
};
