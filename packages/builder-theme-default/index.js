const _forEach = require('lodash/fp/forEach');

/**
 * @returns {HTMLElement}
 */
const createRoot = () => {
  const root = document.createElement('div');
  root.style.position = 'absolute';
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.display = 'grid';
  root.style.gridTemplateColumns = 'auto 1fr';
  root.style.gridGap = '1rem';
  return root;
};

/**
 * @returns {HTMLIFrameElement}
 */
const createIFrame = () => {
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '100%';
  return iframe;
};

/**
 * @param {FabricatorBuilderStoryNav} storyNav
 * @param {function(href:string): void} onclick
 * @returns {HTMLElement}
 */
const createNavLink = (storyNav, onclick) => {
  const link = document.createElement('a');
  link.appendChild(document.createTextNode(storyNav.label));
  link.style.display = 'block';
  link.href = '';
  link.onclick = ($event) => {
    $event.preventDefault();
    $event.stopPropagation();
    onclick(storyNav.href);
  };
  return link;
};

/**
 * @param {Array<FabricatorBuilderStoryNav>} storyNavs
 * @param {function(href:string): void} onclick
 * @returns {HTMLElement}
 */
const createNav = (storyNavs, onclick) => {
  const nav = document.createElement('nav');
  _forEach(storyNav => nav.appendChild(createNavLink(storyNav, onclick)), storyNavs);
  return nav;
};

/**
 * @param {Array<FabricatorBuilderStoryNav>} storyNavs
 * @returns {HTMLElement}
 */
module.exports = function fabricatorTheme(storyNavs) {
  console.log('[@fabricator/builder-theme-default] Building theme...');
  console.log('[@fabricator/builder-theme-default] Theme built');
  const root = createRoot();
  const iframe = createIFrame();
  const nav = createNav(
    storyNavs,
    href => {
      iframe.src = href
    },
  );
  root.appendChild(nav);
  root.appendChild(iframe);
  return root;
};
