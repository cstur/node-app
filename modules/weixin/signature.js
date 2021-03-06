var request = require('request'),
	cache   = require('memory-cache'),
	sha1    = require('sha1');
	env     = require('../../config/index.js');

var config;
if (env.env=='pro') {
	config  = require('../../config/wechat.cfg.js');	
}else{
	config  = require('../../config/wechat.test.cfg.js');
}	

exports.sign = function (url,callback) {
	var noncestr = config.noncestr,
		timestamp = Math.floor(Date.now()/1000), //精确到秒
		access_token,
		jsapi_ticket;
	if(cache.get('ticket')&&cache.get('access_token')){
		jsapi_ticket = cache.get('ticket');
		access_token = cache.get('access_token');
		callback({
			noncestr:noncestr,
			timestamp:timestamp,
			url:url,
			access_token:access_token,
			jsapi_ticket:jsapi_ticket,
			signature:sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
		});
	}else{
		request(config.accessTokenUrl + '?grant_type=' + config.grant_type + '&appid=' + config.appid + '&secret=' + config.secret ,function(error, response, body){
			if (!error && response.statusCode == 200) {
				var tokenMap = JSON.parse(body);
				request(config.ticketUrl + '?access_token=' + tokenMap.access_token + '&type=jsapi', function(error, resp, json){
					if (!error && response.statusCode == 200) {
						var ticketMap = JSON.parse(json);
						cache.put('ticket',ticketMap.ticket,config.cache_duration);  //加入缓存
						cache.put('access_token',tokenMap.access_token);  //加入缓存
						callback({
							noncestr:noncestr,
							timestamp:timestamp,
							url:url,
							access_token:tokenMap.access_token,
							jsapi_ticket:ticketMap.ticket,
							signature:sha1('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
						});
					}
				})
			}
		})
	}
}