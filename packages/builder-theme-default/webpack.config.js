const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = options => ({
  plugins: [
    // new HtmlWebpackPlugin(),
  ],
});

// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         include: /builder-theme-default/,
//         loader: 'babel-loader',
//       },
//       {
//         test: /\.css$/,
//         include: /builder-theme-default/,
//         use: [
//           { loader: 'style-loader' },
//           { loader: 'css-loader' },
//         ],
//       },
//     ],
//   },
// };
