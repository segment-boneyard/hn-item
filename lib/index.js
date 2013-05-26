

var ScoreRequest = require('./request');


module.exports = function (item, callback) {

  var req = new ScoreRequest(item, callback);

  process.nextTick(function () { req.send(); });
  return req;
};


module.exports.ScoreRequest = ScoreRequest;