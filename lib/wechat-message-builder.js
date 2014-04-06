 var xml2js = require('xml2js')
 	, parseString = xml2js.parseString
 	, util = require('util')
	, WechatMessage = require('./wechat-message.js');

var crypto = require('crypto');

var isValidWeixinRequest = function(signature, timestamp, nonce, token){
    var arr = [token, timestamp, nonce];
    arr.sort();

    return crypto.createHash('sha1').update(arr.join('')).digest('hex') === signature;
}


module.exports = function(appid, secret, token){
    
    return function(req, res, next){
    	if ( !isValidWeixinRequest(req.query.signature, req.query.timestamp, req.query.nonce, token)){
            res.statusCode = 404;
            res.end();
            return;
        }

    	var body = '';
    	req.on('data', function(data){ body+=data; });
    
    	req.on('end', function(){

            try{
        		parseString(body, function(err, result){
        			if (err) {
        				console.log('wechatmessagebuilder: parsing error: %j', err);
        		        res.send('');
        		        return;
        			}
        
        			req.wechatMessage = new WechatMessage(result.xml);
        		    console.log('weixinMessage: %j', req.weixinMessage);
        			next();	
        		});
            }catch(e){
                res.statusCode = 500;
                res.end();
            }
    	});
    };
};
