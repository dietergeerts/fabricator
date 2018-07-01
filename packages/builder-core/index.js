/**
 * @typedef {Object} FabricatorBuilderOptions
 * @property {function(): string} Node
 */

/**
 * @param {FabricatorBuilderOptions} options
 */
module.exports = function fabricatorBuild(options) {
  console.log('[@fabricator/builder-core] Building toolkit...');
  document.body.appendChild(options.theme());
  console.log('[@fabricator/builder-core] Toolkit built');
};
