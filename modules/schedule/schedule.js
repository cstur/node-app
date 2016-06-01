var schedule = require("node-schedule");
var database = require('../db/mongodb.js');
var moment   = require('moment');
var summary  = require('../report/report.summary.js');

var report={};
var reportData={};
var reportActData={};

function SummaryTask(db){
	var sum=new summary();
	var appGuangGao='report-guanggao';
	var appTotalOil='act-totaloil';
	
	//Yesterday Range
	var yesterdayStart=moment().subtract(1,'days').startOf('day').toString();
	var yesterdayEnd  =moment().subtract(1,'days').endOf('day').toString();
   	db.getApp(appGuangGao,yesterdayStart,yesterdayEnd,function(err,appData){
   		console.log('guangGaoDay:'+appData.length);
   		reportData.day=appData;
     	report.guangGaoDay=sum.getOptionGuangGao(appData);
     	console.log(report.guangGaoDay.guanggao.series);
  	});

   	db.getApp(appTotalOil,yesterdayStart,yesterdayEnd,function(err,appData){
   		reportActData=appData;
   		console.log('totalOil:'+appData.length);
    	report.totalOil=sum.getOptionTotalOil(appData,'Day');
  	});

 	//Week Range
	var weekStart=moment().locale('zh-cn').subtract(1,'weeks').startOf('week').toString();
	var weekEnd  =moment().locale('zh-cn').subtract(1,'weeks').endOf('week').toString();
   	db.getApp(appGuangGao,weekStart,weekEnd,function(err,appData){
   		console.log('guangGaoWeek:'+appData.length);
   		reportData.week=appData;
     	report.guangGaoWeek=sum.getOptionGuangGao(appData);
  	});

 	//Month Range
	var monthStart=moment().subtract(1,'months').startOf('month').toString();
	var monthEnd  =moment().subtract(1,'months').endOf('month').toString();
   	db.getApp(appGuangGao,monthStart,monthEnd,function(err,appData){
   		console.log('guangGaoMonth:'+appData.length);
     	report.guangGaoMonth=sum.getOptionGuangGao(appData);
  	});	
  	
}

function Schedule(database,app){
	var app=app;
	var db = database;
　　 var rule = new schedule.RecurrenceRule();
　　 rule.minute = 1;

	app.get("/report", function(req, res) {
		res.send(report);
	});
	app.get("/report-guanggao-day", function(req, res) {
		res.send(reportData);
	});
	app.get("/report-act-data", function(req, res) {
		res.send(reportActData);
	});

	SummaryTask(db);
	var j = schedule.scheduleJob(rule, function(){
		SummaryTask(db);
	});
}

Schedule.prototype={

}

module.exports=Schedule;