var requestify = require('requestify');

module.exports = function(appid, appsecret) {
  return function(req, res) {
    var body = "";
    req.on("data", function(data) {
      body += data;
    });

    req.on("end", function() {
      var data = JSON.parse(body);
      var code = data.code;

      var OAUTH_API = "https://api.weixin.qq.com/sns/oauth2/access_token"
                    + "?appid=" + appid
                    + "&secret=" + appsecret
                    + "&code=" + code
                    + "&grant_type=authorization_code";
      requestify.get(OAUTH_API).then(function(response) {
        res.send(response.body);
      });
    });
  }
}
