"use strict";

var _require = require('customize-cra'),
    override = _require.override,
    adjustStyleLoaders = _require.adjustStyleLoaders;

module.exports = override(adjustStyleLoaders(function (rule) {
  if (rule.test.toString().includes('scss')) {
    rule.use.push({
      loader: require.resolve('sass-resources-loader'),
      options: {
        resources: './src/assets/global.scss'
      }
    });
  }
}));