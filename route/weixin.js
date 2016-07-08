var wechat_cfg = require('../config/wechat.cfg.js');
var signature  = require('../modules/weixin/signature.js');
var url = require("url");
var crypto = require("crypto");

exports.signature = function(req,res){
	var url=req.body.targetUrl;
	signature.sign(url,function(signatureMap){
		signatureMap.appId = wechat_cfg.appid;
		res.send(signatureMap);
	});
};

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