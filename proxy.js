var express = require('express');  
var request = require('request');
var config  = require('./config/index.js');

var app = express();  
app.use('/', function(req, res) {  
  var url = config.apiServerHost + req.url;
  req.pipe(request(url)).pipe(res);
});

app.listen(3000);  