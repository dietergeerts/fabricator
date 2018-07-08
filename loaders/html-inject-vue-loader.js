const loaderUtils = require('loader-utils');

module.exports = function () {
  // We only need to use pitch, as we'll create the source and use the other
  // loaders down the chain to request in the generated code.
};

module.exports.pitch = function (remainingRequest) {
  this.cacheable && this.cacheable();
  const componentRequest = `${remainingRequest.replace(/\?.*?$/, '')}?forInjection`;
  return `
const Vue = require('fb-vue');
const VueComponent = require(${loaderUtils.stringifyRequest(this, componentRequest)});
const VueComponentClass = Vue.extend(VueComponent.default);
const vueComponentElement = new VueComponentClass().$mount();
const currentScriptElement = document.currentScript;
currentScriptElement.before(vueComponentElement.$el);
`;
};
