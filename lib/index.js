

var HNScoreRequest = require('./request');


module.exports = function (url, callback) {

  var req = new HNScoreRequest(url, callback);

  process.nextTick(function () { req.send(); });
  return req;
};


module.exports.HNScoreRequest = HNScoreRequest;