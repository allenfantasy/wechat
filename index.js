var WechatMessage = require('./lib/wechat-message.js')
    , wechatHelper = require('./lib/wechat-message-builder.js');


module.exports = {
    'WechatMessage': WechatMessage, //class of a wechat message
    'wechatHelper': function(token, appkey, secret, app){} //generates an express middleware that process wechat messages 
    };
