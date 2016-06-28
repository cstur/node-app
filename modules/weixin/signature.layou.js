var request = require('request'),
	cache   = require('memory-cache'),
	sha1    = require('sha1'),
	config  = require('../../config/wechat.laoyou.cfg.js');

exports.sign = function (url,callback) {
	var noncestr = config.noncestr,
		timestamp = Math.floor(Date.now()/1000), //精确到秒
		access_token,
		jsapi_ticket;
	if(cache.get('ticket_laoyou')&&cache.get('access_token_laoyou')){
		jsapi_ticket = cache.get('ticket_laoyou');
		access_token = cache.get('access_token_laoyou');
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
						cache.put('ticket_laoyou',ticketMap.ticket,config.cache_duration);  //加入缓存
						cache.put('access_token_laoyou',tokenMap.access_token);  //加入缓存
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