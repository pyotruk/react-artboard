const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config, env) {
  // eslint-disable-next-line no-param-reassign
  config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

  // eslint-disable-next-line no-param-reassign
  config.resolve.alias = {
    ...config.resolve.alias,
    // uncomment the next line for debugging local dependencies that have "react" as peer dependency
    // (e.g. "react-gestures": "file:../react-gestures")
    // react: path.resolve('./node_modules/react'),
  };

  return config;
};
