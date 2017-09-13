const packageName = require('../package.json').name;
require('babel-register')({ // eslint-disable-line
  only: new RegExp(`${packageName}/lib`),
  presets: ['es2015', 'stage-0'],
});

module.exports = require('./Runner');
