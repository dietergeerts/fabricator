const loaderUtils = require('loader-utils');

module.exports = function () {
  // We only need to use pitch, as we'll create the source and use the other
  // loaders down the chain to request in the generated code.
};

// Later on, we could extract this template in another step, like done with the
// docs feature, so that the user can define a template of his own for it.
// Also handy to add it to the dependencies so that it's watched.
// TODO: Extract template in another step, this should just create html content.
module.exports.pitch = function (remainingRequest) {
  const options = loaderUtils.getOptions(this) || {};
  this.cacheable && this.cacheable();
  const componentRequest = `${remainingRequest.replace(/\?.*?$/, '')}?forRequire`;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${this.resourcePath.split(/\\/).slice(-1)}</title>
  ${options.base ? `<base href="/${options.base}/">` : '' }
</head>
<body>
<script src=${loaderUtils.stringifyRequest(this, componentRequest)}></script>
</body>
</html>
`;
};
