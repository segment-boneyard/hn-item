
/**
 * Module dependencies.
 */

var HNItemRequest = require('./request');


/**
 * Module exports.
 *
 * @param {String}   url       The Hacker News submission URL to query by.
 * @param {Function} callback
 * @return {Request}
 */

module.exports = function (url, callback) {
  var req = new HNItemRequest(url, callback);
  process.nextTick(function () { req.send(); });
  return req;
};


/**
 * Expose the constructor too.
 */

module.exports.HNItemRequest = HNItemRequest;