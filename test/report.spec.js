var moment   = require('moment');
var summary  = require('../modules/report/report.summary.js');
var _ = require('underscore');

var yesterdayStart=moment().subtract(1,'days').startOf('day').valueOf();
var yesterdayEnd  =moment().subtract(1,'days').endOf('day').valueOf();

var d1=new Date();
d1.setTime(yesterdayStart);
console.log("yesterdayStart to locale:"+d1.toLocaleString());

var d2=new Date();
d2.setTime(yesterdayEnd);
console.log("yesterdayEnd to locale:"+d2.toLocaleString());

var http = require('http');
var url="http://115.159.204.164:8080/q?gte="+yesterdayStart+"&lte="+yesterdayEnd+"&limit=999999&page=0";
var sum=new summary();
var req = http.get(url, function(res) {
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));

  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    var appData=JSON.parse(body);
    var appGuangGaoData = _.filter(appData, function(obj) { 
    	return obj.app=="report-guanggao" 
    });
    var report = sum.getOptionGuangGao(appGuangGaoData);
    console.log(JSON.stringify(report));
    // ...and/or process the entire body here.
  })
});

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});