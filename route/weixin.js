var wechat_cfg = require('../config/wechat.cfg.js');
var signature  = require('../modules/weixin/signature.js');
var url = require("url");
var crypto = require("crypto");
var OAuth = require('wechat-oauth');
var client = new OAuth('wx22c8641086c52351', 'a821ab36f981060789f353f73b6ccf6b');

exports.signature = function(req,res){
	var url=req.body.targetUrl;
	signature.sign(url,function(signatureMap){
		signatureMap.appId = wechat_cfg.appid;
		res.send(signatureMap);
	});
};

exports.getUserInfo = function(req,res){
  var code = req.query.code || "";
  client.getAccessToken(code, function (err, result) {
      var accessToken = result.data.access_token;
      var openid = result.data.openid;
      console.log("-------------------------");
      console.log(accessToken);
      console.log("-------------------------");
      console.log(openid);
      client.getUser(openid, function (err, result) {
        var userInfo = result;
        console.log("-------------------------");
        console.log(userInfo);
        res.json(userInfo);
      });
  });
};

exports.auth=function(req,res){
    var auth_callback_url = "http://zeus.ichezheng.com/weixin/callback";
    var url = client.getAuthorizeURL(auth_callback_url, 'state', 'snsapi_base');
    console.log(url);
    res.redirect(url);
}

exports.callback=function(req,res){
    var code = req.query.code;
    client.getAccessToken(code, function (err, result) {
        console.log(result)
        var accessToken = result.data.access_token;
        var openid = result.data.openid;
        var url='http://test.ichezheng.com/cz/iomobile/www/vip.html?openid='+openid;
        res.writeHead(302, {
          'Location': url
        });
        res.end();
        /*
        client.getUser(openid, function (err, result) {
            var userInfo = result;
            // save or other opration
            res.json(userInfo)
        });
        */
    });
}

function sha1(str){
  var md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}

exports.validateToken = function(req,res){
  var query = url.parse(req.url,true).query;
  var signature = query.signature;
  var echostr = query.echostr;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;
  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = "abc";
  oriArray.sort();
  var original = oriArray.join('');
  console.log("Original str : " + original);
  console.log("Signature : " + signature );
  var scyptoString = sha1(original);
  if(signature == scyptoString){
    res.end(echostr);
    console.log("Confirm and send echo back");
  }else {
    res.end("false");
    console.log("Failed!");
  }
}