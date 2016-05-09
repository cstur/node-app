var database = require('./mongodb.js');
var summary = require('./report.summary.js');

function Report(app){
	var db=new database();
	var sum=new summary();
	var hourMapList={};
	var i=1;

	function increase(appName){
		if (appname in hourMapList) {
		   hourMapList[appName]++;
		} else {
		   hourMapList[appName] = 1;
		}
	}

	function getQueryString(req){
		console.log(req.url);
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
		console.log("appName:"+appName);
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
		console.log('['+new Date().toLocaleString()+']query'+i++);
		var appid=req.query.appid||"";
		var gte=decodeURIComponent(req.query.gte);
		var lte=decodeURIComponent(req.query.lte);

	    //db.getAppCached(appid,gte,lte,function(err,appData){
	   	db.getApp(appid,gte,lte,function(err,appData){
	    	//console.log('res:'+appData);
	     	res.send(appData);
	  	});
	});

	app.get("/report.json", function(req, res) {
		console.log('['+new Date().toLocaleString()+']query'+i++);
		var appid=req.query.appid||"";
		var gte=decodeURIComponent(req.query.gte);
		var lte=decodeURIComponent(req.query.lte);

	    //db.getAppCached(appid,gte,lte,function(err,appData){
	   	db.getApp(appid,gte,lte,function(err,appData){
	     	res.send(sum.getOption(appData));
	  	});
	});

}

Report.prototype={

}

module.exports=Report;