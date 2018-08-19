const path = require('path');
const WebpackStylish = require('webpack-stylish');
const fabricatorBuilder = require('@fabricator/builder');

module.exports = () => fabricatorBuilder(
  {
    docsTest: /README\.md$/,
  },
  {
    context: path.resolve(__dirname, 'src'),
    plugins: [
      new WebpackStylish(),
    ],
  },
);
