/**
 * @returns {function(): Array<Object>}
 */
module.exports = () => () => {
  return [
    {
      loader: 'markdown-it-loader',
    },
  ];
};
