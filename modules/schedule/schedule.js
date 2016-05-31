var schedule = require("node-schedule");
var database = require('../db/mongodb.js');
var moment   = require('moment');
var summary  = require('../report/report.summary.js');

var report={};

function ADSummary(db){
	var sum=new summary();
	var appid='report-guanggao';
	
	//Yesterday Range
	var yesterdayStart=moment().subtract(1,'days').startOf('day').toString();
	var yesterdayEnd  =moment().subtract(1,'days').endOf('day').toString();
   	db.getApp(appid,yesterdayStart,yesterdayEnd,function(err,appData){
     	report.guangGaoDay=sum.getOptionGuangGao(appData);
     	console.log(report.guangGaoDay.guanggao.series);
  	});

   	
 	//Week Range
	var weekStart=moment().locale('zh-cn').subtract(1,'weeks').startOf('week').toString();
	var weekEnd  =moment().locale('zh-cn').subtract(1,'weeks').endOf('week').toString();
   	db.getApp(appid,weekStart,weekEnd,function(err,appData){

     	report.guangGaoWeek=sum.getOptionGuangGao(appData);
     	console.log(report.guangGaoDay.guanggao.series);
  	});

 	//Month Range
	var monthStart=moment().subtract(1,'months').startOf('month').toString();
	var monthEnd  =moment().subtract(1,'months').endOf('month').toString();
   	db.getApp(appid,monthStart,monthEnd,function(err,appData){
     	report.guangGaoMonth=sum.getOptionGuangGao(appData);
     	console.log(report.guangGaoDay.guanggao.series);
  	});	
  	
}

function Schedule(database,app){
	var app=app;
	var db = database;
　　 var rule = new schedule.RecurrenceRule();
　　 rule.minute = 17;

	app.get("/report-guanggao", function(req, res) {
		res.send(report);
	});
	ADSummary(db);
	var j = schedule.scheduleJob(rule, function(){
		ADSummary(db);
	});
}

Schedule.prototype={

}

module.exports=Schedule;