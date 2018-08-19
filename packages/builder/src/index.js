const docsToRequire = require.context(__TOOLKIT_SRC__, true, __TOOLKIT_DOCS__);
const docsRequired = docsToRequire.keys().map(docsToRequire);

console.log('Source directory: ', __TOOLKIT_SRC__);
console.log('Source directory: ', __TOOLKIT_DOCS__);
console.log('Docs to require: ', docsToRequire);
console.log('Docs required: ', docsRequired);
