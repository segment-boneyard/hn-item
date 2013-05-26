
var cheerio      = require('cheerio')
  , hyperquest   = require('hyperquest')
  , EventEmitter = require('events').EventEmitter
  , util         = require('util');


module.exports = ScoreRequest;


function ScoreRequest (item, callback) {
  EventEmitter.call(this);
  this.item     = item;
  this.callback = callback;
  this.url      = "https://news.ycombinator.com/item?id=" + this.item;
}
util.inherits(ScoreRequest, EventEmitter);


ScoreRequest.prototype.send = function () {
  hyperquest(this.url, this.handleResponse.bind(this));
};


ScoreRequest.prototype.handleResponse = function (err, res) {
  if (err) return this.error(err);

  var self = this
    , body = '';

  res
    .on('data',  function (data) { body += data; })
    .on('end',   function ()     { self.parse(body); })
    .on('error', function (err)  { self.error(err); });
};


ScoreRequest.prototype.error = function (err) {
  if (this.listeners('error')) this.emit('error', err);
  if (this.callback) this.callback(err);
};


ScoreRequest.prototype.parse = function (body) {
  var $  = cheerio.load(body)
    , el = $('#score_' + this.item);

  if (!el) this.error(new Error("Couldn't understand the server response"));

  var score = parseInt(el.text().split(' ')[0]); // "134 points" -> 134
  this.emit('data', score);
  if (this.callback) this.callback(null, score);
};


