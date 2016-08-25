var request = require('request');

request('http://115.159.49.124:10007/wxInsurance/home/index', function (error, response, body) {
	console.log(error);
  	console.log(response);
  	console.log(body);
})