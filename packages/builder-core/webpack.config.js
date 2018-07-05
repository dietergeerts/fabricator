module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /builder-core/,
        loader: 'babel-loader',
      },
    ],
  },
};
