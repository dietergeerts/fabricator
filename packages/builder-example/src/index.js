import fabricatorBuild from '@fabricator/builder-core';
import fabricatorTheme from '@fabricator/builder-theme-default';

console.log('[@fabricator/builder-example] Example loaded...');

const requireDocs = require.context('.', true, /\.docs\.html$/);

console.log('[@fabricator/builder-example] Docs to require: ', requireDocs.keys());

const requiredDocs = requireDocs.keys().map(requireDocs);

console.log('[@fabricator/builder-example] Docs required: ', requiredDocs);

fabricatorBuild({
  theme: fabricatorTheme,
});
