var database = require('./mongodb.js');
var summary = require('./report.summary.js');
var _ = require('underscore');

function Report(app,item){
	var db=new database();
	var sum=new summary();
	var hourMapList={};

	function increase(appName){
		if (appname in hourMapList) {
		   hourMapList[appName]++;
		} else {
		   hourMapList[appName] = 1;
		}
	}

	function validateApp(appName){

		var find=0;
		_.map(item.getAppItem(),function(obj){
			if (appName==obj.data.id) {
				find=1;
			}
		});
		return find;
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
		console.log(json);
		var appName=JSON.parse(json).app||'ubt-pv';
		console.log("appName:"+appName);
		if(validateApp(appName)==0){
			console.log('not valid appname:'+appName);
			res.send('500');
			return;
		}
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

	    //db.getAppCached(appid,gte,lte,function(err,appData){
	   	db.getApp(appid,gte,lte,function(err,appData){
	    	//console.log('res:'+appData);
	     	res.send(appData);
	  	});
	});

	app.get("/report.json", function(req, res) {
		var appid=req.query.appid||"";
		var gte=decodeURIComponent(req.query.gte);
		var lte=decodeURIComponent(req.query.lte);

	    //db.getAppCached(appid,gte,lte,function(err,appData){
	   	db.getApp(appid,gte,lte,function(err,appData){
	   		console.log(appData.length);
	   		console.log(appData[0]);
	   		var result=sum.getOption(appData);
	     	res.send(result);
	  	});
	});

	app.get("/guanggao.json", function(req, res) {
		var appid=req.query.appid||"";
		var gte=decodeURIComponent(req.query.gte);
		var lte=decodeURIComponent(req.query.lte);

	   	db.getApp(appid,gte,lte,function(err,appData){
	   		console.log(appData.length);
	   		console.log(appData[0]);
	   		var result=sum.getOptionGuangGao(appData);
	     	res.send(result);
	  	});
	});

}

Report.prototype={

}

module.exports=Report;