import _find from 'lodash/fp/find';
import _forEach from 'lodash/fp/forEach';
import _zipWith from 'lodash/fp/zipWith';

const docsPackage = __TOOLKIT_PKG__;
const docsToRequire = require.context(__TOOLKIT_SRC__, true, /\.docs\.md$/);
const docsRequired = docsToRequire.keys().map(docsToRequire);

const docs = _zipWith(
  (filename, doc) => ({ filename, doc }),
  docsToRequire.keys(),
  docsRequired,
);

document.body.style.margin = '0';
document.body.style.height = '100vh';

const root = document.createElement('div');
root.style.height = '100%';
root.style.display = 'grid';
root.style.gridTemplateRows = 'auto 1fr';
root.style.gridTemplateColumns = 'auto 1fr';
root.style.gridTemplateAreas = '"brand docs" "nav docs"';
document.body.appendChild(root);

const brand = document.createElement('h3');
brand.style.gridArea = 'brand';
brand.style.padding = '.75rem .5rem';
brand.style.margin = '0';
brand.appendChild(document.createTextNode(`${docsPackage.name} v${docsPackage.version}`));
root.appendChild(brand);

const iframe = document.createElement('iframe');
iframe.width = '100%';
iframe.height = '100%';
iframe.style.boxSizing = 'border-box';
iframe.style.gridArea = 'docs';
root.appendChild(iframe);

let selection = window.location.hash.slice(1);
if (selection) {
  const doc = _find({ filename: selection }, docs);
  doc && (iframe.src = doc.doc);
}

const nav = document.createElement('nav');
nav.style.gridArea = 'nav';
_forEach((doc) => {
  const link = document.createElement('a');
  link.href = '';
  link.style.display = 'block';
  link.style.padding = '.5rem';
  link.style.borderTop = '1px solid lightGray';
  link.appendChild(document.createTextNode(doc.filename));
  link.onclick = ($event) => {
    $event.preventDefault();
    iframe.src = doc.doc;
    selection = doc.filename;
    history.pushState(null, null, `#${doc.filename}`)
  };
  nav.appendChild(link);
}, docs);
root.appendChild(nav);
