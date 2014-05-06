var crypto = require('crypto');

var isValidWeixinRequest = function(signature, timestamp, nonce, token) {
  var arr = [token, timestamp, nonce];
  arr.sort();

  return crypto.createHash('sha1').update(arr.join('')).digest('hex') === signature;
}

module.exports = function(token) {
  return function(req, res, next) {
    if (isValidWeixinRequest(req.query.signature, req.query.timestamp, req.query.nonce, token)) {
      res.send(req.query.echostr);
    } else {
      res.send('You didnt pass the validation'); //没有通过微信服务器的验证，可能是微信服务器出错或者恶意请求
    }
  }
}
