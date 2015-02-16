
/*!
 * Express Controllers
 * Copyright(c) 2011-2014 Nicholas Penree <nick@penree.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');
var resource = require('express-resource'); // Monkey patch express
// var readdir = require('fs').readdirSync;
var wrench = require('wrench');
var path = require('path');
var join = path.join;

/**
 * Define resources for all controllers defined in your `controllers` directory
 *
 * This method will create an express resource for all modules in the
 * `controllers path` setting, defaulting to `$CWD/controllers'`.
 * @param {Object} Express app
 * @return {Resource}
 * @api public
 */

module.exports =
express.application.controllers = function(app) {
  var self = app || this;
  var defaultPath =  path.resolve(join(process.cwd(), 'controllers'));
  var controllerPath = self.get('controllers path') || defaultPath;
  var topLevelName = self.get('top level controller') || null;
  var onController = function(name) {
    if (name.match(/^.*\.(coffee|js)$/ig)) {
      var controller = name.replace(path.extname(name), '');
      if (typeof self.resource !== 'undefined') {
        if (controller == topLevelName)
          self.resource(require(join(controllerPath, controller)));
        else
          self.resource(controller, require(join(controllerPath, controller)));
      }
    }
  };
  wrench.readdirSyncRecursive(controllerPath).forEach(onController);
  return self;
};
