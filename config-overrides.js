const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config, env) {
  if (env !== 'development') return config;

  // eslint-disable-next-line no-param-reassign
  config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

  // eslint-disable-next-line no-param-reassign
  config.resolve.alias = {
    ...config.resolve.alias,
    // solves the problem of having "react" as peer dependency
    // e.g. in case when "react-gestures" installed as a local dependency (via file:/)
    react: path.resolve('./node_modules/react'),
  };

  return config;
};
