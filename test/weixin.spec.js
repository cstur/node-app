var OAuth = require('wechat-oauth');
//var client = new OAuth('wx1063580e84d2c111', '6840cf0089c141b3c578b86954a522fc');
var client = new OAuth('wx22c8641086c52351', 'a821ab36f981060789f353f73b6ccf6b');

/* snsapi_base,snsapi_userinfo */

var url = client.getAuthorizeURL('http://zeus.ichezheng.com/weixin/callback'
	, 'state', 'snsapi_base');
	
	/*
var url = client.getAuthorizeURL('http://test.ichezheng.com/cz/appinsur/www/index.html#/abc'
	, 'state', 'snsapi_base');
	*/
console.log(url);

/*

client.getAccessToken('011b6QbE1BU1zf0UtdeE1m8LbE1b6Qbf', function (err, result) {
	console.log(err);
	console.log(result);
  	var accessToken = result.data.access_token;
  	var openid = result.data.openid;
  	console.log("-------------------------");
  	console.log(accessToken);
  	console.log("-------------------------");
  	console.log(openid);
  	/*
	client.getUser(openid, function (err, result) {
	  var userInfo = result;
	  console.log("-------------------------");
	  console.log(userInfo);
	});
	*/
//});

