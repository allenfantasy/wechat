 var xml2js = require('xml2js')
 	, parseString = xml2js.parseString
 	, util = require('util')
	, WechatMessage = require('./helpers/wechat-message.js');



module.exports = function(req, res, next){
	var body = '';
	req.on('data', function(data){ body+=data; });

	req.on('end', function(){
		parseString(body, function(err, result){
			if (err) {
				/*do something*/
				console.log('wechatmessagebuilder: parsing error: %j', err);
		        res.send('');
		        return;
			}

			req.wechatMessage = new WechatMessage(result.xml);
		    console.log('weixinMessage: %j', req.weixinMessage);
			next();	
		});
	});
};
