wechat
======

使用wechat 
```shell
npm install git+https://github.com/Mr-Wiredancer/wechat --save
```


中间件
```javascript
var wechat_middleware = require('nochat').wechatHelper("APPID", "SECRET", "TOKEN)
  , express = require('express');

app = express();

app.post('/weixin', wechat_middleware, function(req, res){
    res.send(req.wechatMessage); //send back message everytime
});

app.listen(3000);

```
