var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

request("http://m.vipchexian.com/#/home", function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);

console.log(body);
  $('.item-banner p').each(function(index){
    var t=$(this).text();
    console.log(t);
  });

});