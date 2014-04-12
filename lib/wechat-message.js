var requestify = require('requestify'),
	Js2Xml = require('js2xml').Js2Xml;

//useful constants
var TEXTTYPE = 'text',
	VOICETYPE = 'voice',
	VIDEOTYPE = 'video',
	LOCATIONTYPE = 'location',
	LINKTYPE = 'link',
	EVENTYPE = 'event',
	IMAGETYPE = 'image',
	NEWSTYPE = 'news',
	MUSICTYPE = 'music';

var WechatMessage = function(data) {
	for (var key in data) {
		var d = data[key];
		this[key] = d.substr ? d : d[0];
	}
};

WechatMessage.prototype.isText = function() {
	return this.MsgType === TEXTTYPE;
};

WechatMessage.prototype.isVoice = function() {
	return this.MsgType === VOICETYPE;
};

WechatMessage.prototype.isRecognizedVoice = function() {
	return this.isVoice() && this.Recognition;
};

WechatMessage.prototype.isImage = function() {
	return this.MsgType === IMAGETYPE;
};

WechatMessage.prototype.isVideo = function() {
	return this.MsgType === VIDEOTYPE;
};

WechatMessage.prototype.isEvent = function() {
	return this.MsgType === EVENTYPE;
};

WechatMessage.prototype.isMusic = function() {
	return this.MsgType === MUSICTYPE;
};

WechatMessage.prototype.isNews = function() {
	return this.MsgType === NEWSTYPE;
};

WechatMessage.prototype.isLink = function() {
	return this.MsgType === LINKTYPE;
};

WechatMessage.prototype.isLocation = function() {
	return this.MsgType === LOCATIONTYPE;
};

WechatMessage.prototype.isNormalMessage = function() {
	return this.isText() || this.isVoice() || this.isImage() || this.isVideo() || this.isLink() || this.isLocation();
}

//event type
WechatMessage.prototype.isSubscribeEvent = function() {
	return this.isEvent() && this.Event === 'subscribe';
};

WechatMessage.prototype.isPureSubscribeEvent = function() {
	return this.isSubscribeEvent && !this.EventKey;
};

WechatMessage.prototype.isUnsubscribeEvent = WechatMessage.prototype.isPureUnsubscribeEvent = function() {
	return this.isEvent() && this.Event === 'unsubscribe';
};

WechatMessage.prototype.isScanBeforeSubscribeEvent = function() {
	return this.isSubscribeEvent() && this.EventKey && this.Ticket;
};

WechatMessage.prototype.isScanAfterSubscribeEvent = function() {
	return this.isEvent() && this.Event === 'SCAN' && this.EventKey && this.Ticket;
};

WechatMessage.prototype.isLocationEvent = function() {
	return this.isEvent() && this.Event === 'LOCATION';
};

WechatMessage.prototype.isClickEvent = function() {
	return this.isEvent() && this.Event === 'CLICK';
};


WechatMessage.prototype.toXML = function() {
	var result = new Js2Xml('xml', this);
	return result.toString();
};

//seems redundant
WechatMessage.prototype.toFormatJSON = function() {
	return JSON.stringify(this);
};

WechatMessage.prototype.isStatsCommand = function() {
	return /^(!|！)统计$/.test(this.Content);
}

WechatMessage.prototype.isResetCommand = function() {
	return /^(!|！)重置$/.test(this.Content);
}

WechatMessage.prototype.isSystemCommand = function() {
	// return this.isRegisterCommand() || this.isResetCommand();
	return this.isRegisterCommand() || this.isCounterRegisterCommand();
};

WechatMessage.prototype.isStartConversationCommand = function() {
	return this.isClickEvent() && this.EventKey != 'MORE';
}

WechatMessage.prototype.isEndConversationCommand = function() {
	return /^((!|！)结束对话|\/:bye)$/.test(this.Content);
};

WechatMessage.prototype.isRegisterCommand = function() {
	return this.isText() && /^(!|！)注册$/.test(this.Content);
};

WechatMessage.prototype.isCounterRegisterCommand = function() {
	return this.isText() && /^(!|！)册注$/.test(this.Content);
};

WechatMessage.prototype.sendThroughKefuInterface = function(token, cb) {
	
	return;
};

WechatMessage.prototype.isKefuCommand = function() {
	return this.isKefuStartCommand() || this.isKefuEndCommand();
};

WechatMessage.prototype.isKefuStartCommand = function() {
	return /^上班$/.test(this.Content);
}

WechatMessage.prototype.isKefuEndCommand = function() {
	return /^下班$/.test(this.Content);
}

WechatMessage.prototype.makeKeFuMessage = function(type, content) {
	var msg = new WechatMessage();
	msg.touser = this.FromUserName;
	msg.msgtype = type;
	if (type != 'news') {
		msg[type] = content;
	} else {
		msg[type] = {'articles': content};
	}
	return msg;
};

var XMLNames = {
	"media_id" : "MediaId",
	"title" : "Title",
	"description" : "Description",
	"musicurl" : "MusicURL",
	"hqmusicurl" : "HQMusicUrl",
	"thumb_media_id" : "ThumbMediaId",
	"picurl" : "PicUrl",
	"url" : "Url"
};

//automatic response to an incoming message. return a new WechatMessage object. 
WechatMessage.prototype.makeResponseMessage = function(type, content) {
	var msg = new WechatMessage();
	msg.FromUserName = this.ToUserName;
	msg.ToUserName = this.FromUserName;
	msg.MsgType = type;
	msg.CreateTime = (new Date).getTime().toString();

	if (msg.isText()) {
		msg.Content = content.content;
	} else if (msg.isImage() || msg.isVoice() || msg.isVideo || msg.isMusic()) {
		var newType = type.charAt(0).toUpperCase() + type.slice(1);  // capitalize
		msg[newType] = {}
		for (var index in content)
			msg[newType][XMLNames[index]] = content[index];
	} else if (msg.isNews()) {
		msg.ArticleCount = content.articles.length;
		msg.Articles = [];
		for (var i = 0; i < msg.ArticleCount; ++i)
			msg.Articles[i][XMLNames[index]] = content.articles[i][index];
	}

	return msg;
};

WechatMessage.prototype.sendKeFuMessage = function(token, type, content, cb) {
	requestify.post(
		'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=' + token
		, this.makeKeFuMessage(type, content))
	.then(cb);
	return;
}

// sendResponseMessage
WechatMessage.prototype.sendResponseMessage = function(req, res, type, content) {
	res.send(req.wechatMessage.makeResponseMessage(type, content).toXML());
}

// getNickname
WechatMessage.prototype.getNickname = function(app, callback) {
	openid = this.FromUserName;
	requestify.get("https://api.weixin.qq.com/cgi-bin/user/info?access_token="
	 + app.get('ACCESSTOKEN') + "&openid=" + openid + "&lang=zh_CN")
		.then(function(response) {
			callback(response.getBody().nickname);
		}
	);
};


module.exports = WechatMessage;