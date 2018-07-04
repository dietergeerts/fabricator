const _map = require('lodash/fp/map');

/**
 * @typedef {Object} FabricatorBuilderOptions
 * @property {function(Array<FabricatorBuilderStoryNav>): string} theme
 * @property {Array<FabricatorBuilderStory>} stories
 */

/**
 * @typedef {Object} FabricatorBuilderStory
 * @property {string} filename - original source file
 * @property {string} story - resulting filename
 */

/**
 * @typedef {Object} FabricatorBuilderStoryNav
 * @property {string} label
 * @property {string} href
 */

/**
 * @param {Array<FabricatorBuilderStory>} stories
 * @returns {Array<FabricatorBuilderStoryNav>}
 */
const toStoryNavs = _map(story => ({ label: story.filename, href: story.story }));


/**
 * @param {FabricatorBuilderOptions} options
 */
module.exports = function fabricatorBuild(options) {
  console.log('[@fabricator/builder-core] Building toolkit...');
  document.body.appendChild(options.theme(toStoryNavs(options.stories)));
  console.log('[@fabricator/builder-core] Toolkit built');
};
