import _zipWith from 'lodash/fp/zipWith';

const docsToRequire = require.context(__TOOLKIT_SRC__, true, /\.docs\.md$/);
const docsRequired = docsToRequire.keys().map(docsToRequire);

const docs = _zipWith(
  (filename, doc) => ({ filename, doc }),
  docsToRequire.keys(),
  docsRequired,
);

console.log(docs);
