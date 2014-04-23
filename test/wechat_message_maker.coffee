WechatMessage = require('../index.js').WechatMessage
parseString = require('xml2js').parseString
Js2Xml = require('js2xml').Js2Xml

describe '传入数据库存储格式的content，检查返回的json字符串', ()->
	msg = {}

	beforeEach (done)->
		parseString tplMsgs.txtMsg, (err, result)->
			expect(err).to.not.exist
			msg = new WechatMessage(result.xml)
			done()

	it "should 正确返回文本", (done)->
		response = msg.makeKeFuMessage('text', tplMsgs.txtContent, msg.FromUserName)
		sample =
			"touser":"fromUser"
			"msgtype":"text"
			"text":
				"content":"Hello World"
		expect(JSON.stringify(response)).to.equal(JSON.stringify(sample))
		done()

	it "should 正确返回图片", (done)->
		response = msg.makeKeFuMessage('image', tplMsgs.imgContent, msg.FromUserName)
		sample =
			"touser":"fromUser"
			"msgtype":"image"
			"image":
				"media_id":"MEDIA_ID"
		expect(JSON.stringify(response)).to.equal(JSON.stringify(sample))
		done()

	it "should 正确返回语音", (done)->
		response = msg.makeKeFuMessage('voice', tplMsgs.voiceContent, msg.FromUserName)
		sample =
			"touser":"fromUser"
			"msgtype":"voice"
			"voice":
				"media_id":"MEDIA_ID"
		expect(JSON.stringify(response)).to.equal(JSON.stringify(sample))
		done()

	it "should 正确返回视频", (done)->
		response = msg.makeKeFuMessage('video', tplMsgs.videoContent, msg.FromUserName)
		sample =
			"touser":"fromUser"
			"msgtype":"video"
			"video":
				"media_id":"MEDIA_ID"
				"title":"TITLE"
				"description":"DESCRIPTION"
		expect(JSON.stringify(response)).to.equal(JSON.stringify(sample))
		done()

	it "should 正确返回音乐", (done)->
		response = msg.makeKeFuMessage('music', tplMsgs.musicContent, msg.FromUserName)
		sample =
			"touser":"fromUser"
			"msgtype":"music"
			"music":
				"title":"MUSIC_TITLE"
				"description":"MUSIC_DESCRIPTION"
				"musicurl":"MUSIC_URL"
				"hqmusicurl":"HQ_MUSIC_URL"
				"thumb_media_id":"THUMB_MEDIA_ID"
		expect(JSON.stringify(response)).to.equal(JSON.stringify(sample))
		done()

	it "should 正确返回图文消息", (done)->
		response = msg.makeKeFuMessage('news', tplMsgs.newsContent, msg.FromUserName)
		sample = 
			"touser":"fromUser"
			"msgtype":"news"
			"news":
				"articles": [
					"title":"Happy Day1"
					"description":"Is Really A Happy Day"
					"url":"URL"
					"picurl":"PIC_URL"
				,
					"title":"Happy Day2"
					"description":"Is Really A Happy Day"
					"url":"URL"
					"picurl":"PIC_URL"
				]
		expect(JSON.stringify(response)).to.equal(JSON.stringify(sample))
		done()

describe '传入数据库存储格式的content，检查返回的XML字符串', ()->
	msg = {}

	beforeEach (done)->
		parseString tplMsgs.txtMsg, (err, result)->
			expect(err).to.not.exist
			msg = new WechatMessage(result.xml)
			done()

	it "should 正确返回文本", (done)->
		response = msg.makeResponseMessage('text', tplMsgs.txtContent)
		tmp = new Js2Xml('xml', response)
		XMLstr = tmp.toString()
		parseString XMLstr, (err, result)->
			expect(err).to.not.exist
			expect(result.xml.FromUserName[0]).to.equal("toUser")
			expect(result.xml.ToUserName[0]).to.equal("fromUser")
			expect(Date.now() - result.xml.CreateTime[0]).to.be.below(5000)
			expect(result.xml.MsgType[0]).to.equal("text")
			expect(result.xml.Content[0]).to.equal("Hello World")
		done()

	it "should 正确返回图片", (done)->
		response = msg.makeResponseMessage('image', tplMsgs.imgContent)
		tmp = new Js2Xml('xml', response)
		XMLstr = tmp.toString()
		parseString XMLstr, (err, result)->
			expect(err).to.not.exist
			expect(result.xml.FromUserName[0]).to.equal("toUser")
			expect(result.xml.ToUserName[0]).to.equal("fromUser")
			expect(Date.now() - result.xml.CreateTime[0]).to.be.below(5000)
			expect(result.xml.MsgType[0]).to.equal("image")
			expect(result.xml.Image[0].MediaId[0]).to.equal("MEDIA_ID")
		done()

	it "should 正确返回语音", (done)->
		response = msg.makeResponseMessage('voice', tplMsgs.voiceContent)
		tmp = new Js2Xml('xml', response)
		XMLstr = tmp.toString()
		parseString XMLstr, (err, result)->
			expect(err).to.not.exist
			expect(result.xml.FromUserName[0]).to.equal("toUser")
			expect(result.xml.ToUserName[0]).to.equal("fromUser")
			expect(Date.now() - result.xml.CreateTime[0]).to.be.below(5000)
			expect(result.xml.MsgType[0]).to.equal("voice")
			expect(result.xml.Voice[0].MediaId[0]).to.equal("MEDIA_ID")
		done()

	it "should 正确返回视频", (done)->
		response = msg.makeResponseMessage('video', tplMsgs.videoContent)
		tmp = new Js2Xml('xml', response)
		XMLstr = tmp.toString()
		parseString XMLstr, (err, result)->
			expect(err).to.not.exist
			expect(result.xml.FromUserName[0]).to.equal("toUser")
			expect(result.xml.ToUserName[0]).to.equal("fromUser")
			expect(Date.now() - result.xml.CreateTime[0]).to.be.below(5000)
			expect(result.xml.MsgType[0]).to.equal("video")
			expect(result.xml.Video[0].MediaId[0]).to.equal("MEDIA_ID")
			expect(result.xml.Video[0].Title[0]).to.equal("TITLE")
			expect(result.xml.Video[0].Description[0]).to.equal("DESCRIPTION")
		done()

	it "should 正确返回音乐", (done)->
		response = msg.makeResponseMessage('music', tplMsgs.musicContent)
		tmp = new Js2Xml('xml', response)
		XMLstr = tmp.toString()
		parseString XMLstr, (err, result)->
			expect(err).to.not.exist
			expect(result.xml.FromUserName[0]).to.equal("toUser")
			expect(result.xml.ToUserName[0]).to.equal("fromUser")
			expect(Date.now() - result.xml.CreateTime[0]).to.be.below(5000)
			expect(result.xml.MsgType[0]).to.equal("music")
			expect(result.xml.Music[0].MusicUrl[0]).to.equal("MUSIC_URL")
			expect(result.xml.Music[0].Title[0]).to.equal("MUSIC_TITLE")
			expect(result.xml.Music[0].Description[0]).to.equal("MUSIC_DESCRIPTION")
			expect(result.xml.Music[0].HQMusicUrl[0]).to.equal("HQ_MUSIC_URL")
			expect(result.xml.Music[0].ThumbMediaId[0]).to.equal("THUMB_MEDIA_ID")
		done()

	it "should 正确返回图文消息", (done)->
		response = msg.makeResponseMessage('news', tplMsgs.newsContent)
		tmp = new Js2Xml('xml', response)
		XMLstr = tmp.toString()
		parseString XMLstr, (err, result)->
			expect(err).to.not.exist
			expect(result.xml.FromUserName[0]).to.equal("toUser")
			expect(result.xml.ToUserName[0]).to.equal("fromUser")
			expect(Date.now() - result.xml.CreateTime[0]).to.be.below(5000)
			expect(result.xml.MsgType[0]).to.equal("news")
			item1 =
				Title: ["Happy Day1"]
				Description: ["Is Really A Happy Day"]
				Url: ["URL"]
				PicUrl: ["PIC_URL"]
			item2 =
				Title: ["Happy Day2"]
				Description: ["Is Really A Happy Day"]
				Url: ["URL"]
				PicUrl: ["PIC_URL"]
			expect(result.xml.Articles[0].item[0]).to.deep.equal(item1)
			expect(result.xml.Articles[0].item[1]).to.deep.equal(item2)
		done()