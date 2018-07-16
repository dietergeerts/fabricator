const path = require('path');
const WebpackStylish = require('webpack-stylish');
const fabricatorBuilder = require('@fabricator/builder');

module.exports = () => fabricatorBuilder({
  context: path.resolve(__dirname, 'src'),
  plugins: [
    new WebpackStylish(),
  ],
});
