wechatHelper = require('../index.js').wechatHelper
express = require 'express'
request = require 'supertest'
crypto = require 'crypto'

generateSignature = (timestamp, nonce, token)->
	arr = [timestamp, nonce, token]
	arr.sort()
	crypto.createHash('sha1').update(arr.join('')).digest('hex')

describe "中间件", ()->
	describe 'invalid request', ()->
		middleware = app = TOKEN = undefined 

		before ()->
			app = express()
			TOKEN = 'TESTING'
			app.post '/weixin', wechatHelper('TEST', "TEST", TOKEN)

		it "should return 404 when signature doesn't pass validation", (done)->
			timestamp =  (new Date).getTime()
			nonce = '528602'

			request(app)
				.post('/weixin?signature='+generateSignature(timestamp, nonce, TOKEN)
					+'1'
					+'&timestamp='+timestamp+'&nonce='+nonce)
				.expect(404, done)

		it "should return 404 when no needed params", (done)->
			request(app)
				.post('/weixin')
				.expect(404, done)


	describe 'valid but broken request', ()->
		middlware = app = TOKEN = undefined

		before ()->
			app = express()
			TOKEN = 'TESTING'
			app.post '/weixin', wechatHelper('TEST', "TEST", TOKEN)

		it "should return 500 if signature passed but content is broken", (done)->
			timestamp =  (new Date).getTime()
			nonce = '528602'

			request(app)
				.post('/weixin?signature='+generateSignature(timestamp, nonce, TOKEN)+'&timestamp='+timestamp+'&nonce='+nonce)
				.expect(500, done)

