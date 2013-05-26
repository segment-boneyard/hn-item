
/**
 * Module dependencies.
 */

var hyperquest   = require('hyperquest')
  , EventEmitter = require('events').EventEmitter
  , util         = require('util')
  , qs           = require('querystring');


/**
 * Module exports.
 */

module.exports = HNItemRequest;

function HNItemRequest (url, callback) {
  EventEmitter.call(this);
  this.url = url;
  this.callback = callback;
}


/**
 * Mixin emitting.
 */

util.inherits(HNItemRequest, EventEmitter);


/**
 * Send off the request.
 */

HNItemRequest.prototype.send = function () {
  var url = 'http://api.thriftdb.com/api.hnsearch.com/items/_search?' +
            qs.stringify({ 'filter[fields][url]' : this.url });
  hyperquest(url, this.handleResponse.bind(this));
};


/**
 * Handle the response.
 */

HNItemRequest.prototype.handleResponse = function (err, res) {
  if (err) return this.error(err);

  var self = this
    , body = '';

  res
    .on('data',  function (data) { body += data; })
    .on('end',   function ()     { self.parse(body); })
    .on('error', function (err)  { self.error(err); });
};


/**
 * Error handler.
 *
 * @param {Error} err
 */

HNItemRequest.prototype.error = function (err) {
  if (this.listeners('error')) this.emit('error', err);
  if (this.callback) this.callback(err);
};


/**
 * Parse the response.
 *
 * @param {Object} body  The response body.
 */

HNItemRequest.prototype.parse = function (body) {
  var result = JSON.parse(body).results[0]
    , score  = result ? result.item.points : 0;

  this.emit('data', score);
  if (this.callback) this.callback(null, score);
};