var OAuth = require('wechat-oauth');
var client = new OAuth('wx22c8641086c52351', 'a821ab36f981060789f353f73b6ccf6b');

var url = client.getAuthorizeURL('http://test.ichezheng.com/cz/appinsur/www/index.html#/abc'
	, 'state', 'snsapi_userinfo');
//console.log(url);


client.getAccessToken('0418080Q0JSd0f23e3YP01T40Q080805', function (err, result) {
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
	});
});
