var chance = require('chance').Chance();
var moment  = require('moment');

function randomPV(){
	var sHour=chance.integer({min: 1, max: 10});
	var timestamp1=moment().subtract(sHour,'hours').valueOf();

	var mockPV={
	  "app":"cz",
	  "ubt_client_version":"1.0.0",
	  "pvid":"abc1",
	  "prePVID":"123"
	};
	mockPV.app=chance.pickone(["cz", "laoyou"]);
	mockPV.accessTime=timestamp1;
	mockPV.leaveTime=timestamp1;
	mockPV.uid = chance.integer({min: 340, max: 342})+"";
	mockPV.ubt_client_type= chance.pickone(["h5", "android", "ios"]);

	if (mockPV.ubt_client_type=="android") {
		//mockPV.pvid=chance.integer({min: 2000, max: 2999})+"";
		//mockPV.prePVID=chance.integer({min: 2000, max: 2999})+"";
		mockPV.data={
	    "android":{
	      "version":"4.1",
	      "click":[{
	        "id":"btn1",
	        "ele":{
	          "tagName":"BUTTON"
	        },
	        "time":"1465219604000"
	      },{
	        "id":"input1",
	        "ele":{
	          "tagName":"INPUT"
	        },
	        "time":"1465219604000"
	      }]
	    }
	  	}	
	}
	else if (mockPV.ubt_client_type=="ios") {
		//mockPV.pvid=chance.integer({min: 1000, max: 1999});
		//mockPV.prePVID=chance.integer({min: 1000, max: 1999});	
		mockPV.data={
	    "ios":{
	      "version":"4.1",
	      "click":[{
	        "id":"btn1",
	        "ele":{
	          "tagName":"BUTTON"
	        },
	        "time":"1465219604000"
	      },{
	        "id":"input1",
	        "ele":{
	          "tagName":"INPUT"
	        },
	        "time":"1465219604000"
	      }]
	    }
	  	}
	}

	else{
		//mockPV.pvid=chance.integer({min: 3000, max: 3999});
		//mockPV.prePVID=chance.integer({min: 3000, max: 3999});	
		mockPV.data={
	    "web":{
	      "ua":{},
	      "page_url":"http://r.ichezheng.com/h5/tixian",
	      "click":[{
	        "id":"btn1",
	        "ele":{
	          "tagName":"BUTTON"
	        },
	        "time":"1465219604000"
	      },{
	        "id":"input1",
	        "ele":{
	          "tagName":"INPUT"
	        },
	        "time":"1465219604000"
	      }]
	    }
	  	}	
	}

	console.log(JSON.stringify(mockPV));

	var http = require('http');
	var querystring = require("querystring");
	var queryStr=encodeURIComponent(JSON.stringify(mockPV));
	//var url="http://localhost:8080/pv.gif?"+queryStr;
	var url="http://139.196.31.108:7003/pv.gif?"+queryStr;
	console.log(url);
	var req = http.get(url, function(res) {
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    bodyChunks.push(chunk);
	  }).on('end', function() {
	    var body = Buffer.concat(bodyChunks);
	    //console.log(JSON.parse(body));
	  })
	});

	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});

}

console.time("dbsave");
for (var i = 6; i >= 0; i--) {
	randomPV();
}
console.timeEnd("dbsave");


