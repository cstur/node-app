'use strict';

var path = require('path');
var extend = require('util')._extend;

var development = require('./env/dev.js');
var test = require('./env/test.js');
var production = require('./env/pro.js');

var notifier = {
};

var defaults = {
  root: path.join(__dirname, '..'),
  notifier: notifier
};

module.exports = {
  development: extend(development, defaults),
  test: extend(test, defaults),
  production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];
