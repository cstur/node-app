var database = require('./mongodb.js');

function Report(app){
	var db=new database();
	var hourMapList={};

	function increase(appName){
		if (appname in hourMapList) {
		   hourMapList[appName]++;
		} else {
		   hourMapList[appName] = 1;
		}
	}

	function getQueryString(req){
		var queryString=require('url').parse(req.url).query;
		var json=decodeURIComponent(queryString);
		return json;
	}

	app.get("/jserror.gif", function(req, res) {
		var json = getQueryString(req);
		var appName='js-error';
		var data={app:appName,data:json};
		db.saveApp(data);
		res.send('200');
	});

	app.get("/jserror-test.gif", function(req, res) {
		var json = getQueryString(req);
		var appName='js-error';
		appName=appName+'-test';
		var data={app:appName,data:json};
		db.saveApp(data);
		res.send('200');
	});

	app.get("/pv.gif", function(req, res) {
		var json = getQueryString(req);
		var appName=JSON.parse(json).app||'ubt-pv';
		var data={app:appName,data:json};
		db.saveApp(data);
		res.send('200');
	});

	app.get("/pv-test.gif", function(req, res) {
		var json = getQueryString(req);
		var appName=JSON.parse(json).app||'ubt-pv';
		appName=appName+'-test';
		var data={app:appName,data:json};
		db.saveApp(data);
		res.send('200');
	});

	app.get("/query", function(req, res) {
		var appid=req.query.appid||"";
		var gte=decodeURIComponent(req.query.gte);
		var lte=decodeURIComponent(req.query.lte);

	    db.getApp(appid,gte,lte,function(err,appData){
	     	res.send(appData);
	  	});
	});

}

Report.prototype={

}

module.exports=Report;