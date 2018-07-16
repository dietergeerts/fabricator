const docsToRequire = require.context(__TOOLKIT_SRC__, true, /\.README\.md$/);
const docsRequired = docsToRequire.keys().map(docsToRequire);

console.log('Docs to require: ', docsToRequire);
console.log('Docs required: ', docsRequired);
