WechatMessage = require('../index.js').WechatMessage
parseString = require('xml2js').parseString

describe '普通消息', ()->
    before ()->

    it "should correctly parse 文本(tplMsgs.txtMsg)", (done)->
        parseString tplMsgs.txtMsg, (err, result)->
            expect(err).to.not.exist

            msg = new WechatMessage(result.xml)
            expect(msg.FromUserName).to.equal('fromUser')
            expect(msg.ToUserName).to.equal('toUser');
            expect(msg.MsgType).to.equal('text')
            expect(msg.MsgId).to.equal('1234567890123456')
            expect(msg.isText()).to.be.true
            done()
        
    it "should correctly parse 图片(tplMsgs.imgMsg)", ()->

    it "should correctly parse 语音(tplMsgs.voiceMsg)", ()->

    it "should correctly parse 视频(tplMsgs.videoMsg)", ()->

    it "should correctly parse 地理位置(tplMsgs.geoMsg)", ()->

    it "should corrently parse 链接(tplMsgs.linkMsg)", ()->


describe '事件推送', ()->
    before ()->


    it "should correctly parse 关注/取消关注事件(tplMsgs.subUnsubEvent)", ()->

    it "should correctly parse 未关注扫描带参数二维码事件(tplMsgs.scanUnsubEvent)", ()->

    it "should correctly parse 已关注扫描带参数二维码事件(tplMsgs.scanSubEvent)", ()->

    it "should correctly parse 上报地理位置事件(tplMsgs.geoReportEvent)", ()->

    it "should correctly parse 菜单拉取消息事件(tplMsgs.menuGetEvent)", ()->

    it "should correctly parse 菜单跳转链接时的事件(tplMsgs.menuLinkEvent)", ()->








