const path = require('path');
const WebpackStylish = require('webpack-stylish');
const fabricatorBuilder = require('@fabricator/builder');
const markdownDocs = require('@fabricator/markdown-docs');

module.exports = () => fabricatorBuilder(
  {
    docsTest: /README\.md$/,
    docsPreLoaders: markdownDocs(),
  },
  {
    context: path.resolve(__dirname, 'src'),
    plugins: [
      new WebpackStylish(),
    ],
  },
);
