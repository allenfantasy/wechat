var xml2js = require('xml2js')
  , parseString = xml2js.parseString
  , util = require('util')
  , concat = require('concat-stream')
  , crypto = require('crypto')
  , WechatMessage = require('./wechat-message.js');

/**
 * 加密/校验流程如下：1. 将token、timestamp、nonce三个参数进行字典序排序; 2. 将三个参数字符串拼接成一个字符串进行sha1加密; 3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
 * @param  {[type]}  signature 
 * @param  {[type]}  timestamp
 * @param  {[type]}  nonce
 * @param  {[type]}  token 在微信公众号上预设的token，用来校验请求的合法性
 * @return {Boolean}
 */
var isValidWeixinRequest = function(signature, timestamp, nonce, token) {
  var arr = [token, timestamp, nonce];
  arr.sort();

  return crypto.createHash('sha1').update(arr.join('')).digest('hex') === signature;
}

/**
 * 生成一个 express 中间件，校验请求url的参数，若合法，则添加req.wechatMessage字段
 * @param  {[type]} appid 好像暂时没啥用
 * @param  {[type]} secret 好像暂时没啥用
 * @param  {[type]} token 在微信公众号上预设的token，用来校验请求的合法性
 * @param  {[type]} db 可选的redis client，用来获取access token. redis.createClient()的返回值.
 * @return {[type]}
 */
module.exports = function(appid, secret, token, db) {

  return function(req, res, next) {

    //若不是合法请求则返回404
    if (!isValidWeixinRequest(req.query.signature, req.query.timestamp, req.query.nonce, token)) {
      res.statusCode = 404;
      res.end();
      return;
    }

    req.pipe(concat(function(data){

      //将xml转换成object
      parseString(data, function(err, result) {
        if (err) {
          console.log('wechatmessagebuilder: parsing error: %j', err);
          res.send('');
          return;
        }

        req.wechatMessage = new WechatMessage(result.xml, db);
        next();
      });
    }));
  };
};