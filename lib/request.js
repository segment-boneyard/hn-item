
var hyperquest   = require('hyperquest')
  , EventEmitter = require('events').EventEmitter
  , util         = require('util')
  , qs           = require('querystring');


module.exports = HNScoreRequest;


function HNScoreRequest (url, callback) {
  EventEmitter.call(this);
  this.url      = url;
  this.callback = callback;
}
util.inherits(HNScoreRequest, EventEmitter);


HNScoreRequest.prototype.send = function () {
  var url = 'http://api.thriftdb.com/api.hnsearch.com/items/_search?' +
            qs.stringify({ 'filter[fields][url]' : this.url });
  hyperquest(url, this.handleResponse.bind(this));
};


HNScoreRequest.prototype.handleResponse = function (err, res) {
  if (err) return this.error(err);

  var self = this
    , body = '';

  res
    .on('data',  function (data) { body += data; })
    .on('end',   function ()     { self.parse(body); })
    .on('error', function (err)  { self.error(err); });
};


HNScoreRequest.prototype.error = function (err) {
  if (this.listeners('error')) this.emit('error', err);
  if (this.callback) this.callback(err);
};


HNScoreRequest.prototype.parse = function (body) {
  var result = JSON.parse(body).results[0]
    , score  = 0;

  if (result) score = result.item.points;

  this.emit('data', score);
  if (this.callback) this.callback(null, score);
};


