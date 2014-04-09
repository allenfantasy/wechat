var requestify = require('requestify')
    , Js2Xml = require('js2xml').Js2Xml;

//useful constants
var TEXTTYPE = 'text'
	, VOICETYPE = 'voice'
	, VIDEOTYPE = 'video'
	, LOCATIONTYPE = 'location'
	, LINKTYPE = 'link'
	, EVENTYPE = 'event'
	, IMAGETYPE = 'image';


var WechatMessage = function(data){
	for (var key in data){
		var d = data[key];
		this[key] = d.substr?d:d[0];
	}
};

WechatMessage.prototype.isText = function(){
	return this.MsgType === TEXTTYPE;
};

WechatMessage.prototype.isVoice = function(){
	return this.MsgType === VOICETYPE;
};

WechatMessage.prototype.isRecognizedVoice = function(){
	return this.isVoice() && this.Recognition;
};

WechatMessage.prototype.isImage = function(){
	return this.MsgType === IMAGETYPE;
};

WechatMessage.prototype.isVideo = function(){
	return this.MsgType === VIDEOTYPE;
};

WechatMessage.prototype.isEvent = function(){
	return this.MsgType === EVENTYPE;
};

WechatMessage.prototype.isLink = function(){
	return this.MsgType === LINKTYPE;
};

WechatMessage.prototype.isLocation = function(){
	return this.MsgType === LOCATIONTYPE;
};

WechatMessage.prototype.isNormalMessage = function(){
	return this.isText() || this.isVoice() || this.isImage() || this.isVideo() || this.isLink() || this.isLocation();
}

//event type
WechatMessage.prototype.isSubscribeEvent = function(){
	return this.isEvent() && this.Event === 'subscribe';
};

WechatMessage.prototype.isPureSubscribeEvent = function(){
	return this.isSubscribeEvent && !this.EventKey;
};

WechatMessage.prototype.isUnsubscribeEvent = WechatMessage.prototype.isPureUnsubscribeEvent = function(){
	return this.isEvent() && this.Event === 'unsubscribe';
};

WechatMessage.prototype.isScanBeforeSubscribeEvent = function(){
	return this.isSubscribeEvent() && this.EventKey && this.Ticket;
};

WechatMessage.prototype.isScanAfterSubscribeEvent = function(){
	return this.isEvent() && this.Event === 'SCAN' && this.EventKey && this.Ticket;
};

WechatMessage.prototype.isLocationEvent = function(){
	return this.isEvent() && this.Event === 'LOCATION';
};

WechatMessage.prototype.isClickEvent = function(){
	return this.isEvent() && this.Event === 'CLICK';
};


WechatMessage.prototype.toXML = function(){
	var result = new Js2Xml('xml', this);
	return result.toString();
};

//seems redundant
WechatMessage.prototype.toFormatJSON = function(){
	return JSON.stringify(this);
};

WechatMessage.prototype.isStatsCommand = function(){
	return /^(!|！)统计$/.test(this.Content);
}

WechatMessage.prototype.isResetCommand = function(){
	return /^(!|！)重置$/.test(this.Content);
}

WechatMessage.prototype.isSystemCommand = function(){
	// return this.isRegisterCommand() || this.isResetCommand();
	return this.isRegisterCommand() || this.isCounterRegisterCommand();
};

WechatMessage.prototype.isStartConversationCommand = function(){
	return this.isClickEvent() && this.EventKey!='MORE';
}

WechatMessage.prototype.isEndConversationCommand = function(){
	return /^((!|！)结束对话|\/:bye)$/.test(this.Content);
};

WechatMessage.prototype.isRegisterCommand = function(){
	return this.isText() && /^(!|！)注册$/.test(this.Content);
};

WechatMessage.prototype.isCounterRegisterCommand = function(){
	return this.isText() && /^(!|！)册注$/.test(this.Content);
};

WechatMessage.prototype.forwardTo = function(token, toUserName, cb){
	var msgData;

    if (this.isText()){
		msgData = {
			'touser': [toUserName],
			'msgtype': ['text'],
			'text': [{'content':this.Content}]
		};
	}else if (this.isImage()){

		msgData = {
			'touser': [toUserName],
			'msgtype': ['image'],
			'image': [{'media_id': this.MediaId}]
		};
	}else if (this.isVoice()){
		msgData = {
			'touser': [toUserName],
			'msgtype': ['voice'],
			'voice': [{'media_id': this.MediaId}]
		}
	}else if (this.isVideo()){
		msgData = {
			'touser': [toUserName],
			'msgtype': ['voice'],
			'video':[{
				'media_id': this.MediaId,
				'title': 'TITLE', //TODO: these are placeholders
				'description': 'DESCRIPTION'
			}]
		}
	}

	var m = new WechatMessage(msgData);
	m.sendThroughKefuInterface(token, cb);
	return;
}

WechatMessage.prototype.sendThroughKefuInterface = function(token, cb){
	requestify.post('https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+token, this).then(cb);
	return;
};

WechatMessage.prototype.isKefuCommand = function(){
	return this.isKefuStartCommand() || this.isKefuEndCommand();
};

WechatMessage.prototype.isKefuStartCommand = function(){
	return /^上班$/.test(this.Content);
}

WechatMessage.prototype.isKefuEndCommand = function(){
	return /^下班$/.test(this.Content);
}

//automatic response to an incoming message. return a new WechatMessage object. 
WechatMessage.prototype.makeResponseMessage = function(type, content){
	var msg = new WechatMessage();
	msg.FromUserName = this.ToUserName;
	msg.ToUserName = this.FromUserName;

	msg.MsgType = type;
	msg.CreateTime = (new Date).getTime().toString();
	if (type === TEXTTYPE){
		msg.Content = content;
	}else if (type === IMAGETYPE || type === VOICETYPE){
		msg.MediaId = content;
	}

	return msg;
};

module.exports = WechatMessage;
