var wechat_cfg = require('../config/wechat.laoyou.cfg.js');
var signature  = require('../modules/weixin/signature.laoyou.js');

exports.signature = function(req,res){
	var url=req.body.targetUrl;
	signature.sign(url,function(signatureMap){
		signatureMap.appId = wechat_cfg.appid;
		res.send(signatureMap);
	});
};