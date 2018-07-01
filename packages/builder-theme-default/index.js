module.exports = function fabricatorTheme() {
  console.log('[@fabricator/builder-theme-default] Building theme...');
  console.log('[@fabricator/builder-theme-default] Theme built');
  const theme = document.createElement('h1');
  theme.innerHTML = 'FABRICATOR THEME DEFAULT';
  return theme;
};
