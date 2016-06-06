var schedule = require("node-schedule");
var database = require('../db/mongodb.js');
var moment   = require('moment');
var summary  = require('../report/report.summary.js');

var report={};
var reportData={};
var reportActData={};

function SummaryTask(db,logger){
	logger.info("Start Schedule Task...");
	var appGuangGao='report-guanggao';
	var appTotalOil='act-totaloil';
	
	//Yesterday Range
	var yesterdayStart=moment().subtract(1,'days').startOf('day').valueOf();
	var yesterdayEnd  =moment().subtract(1,'days').endOf('day').valueOf();
	logger.info("Report GuangGao From:"+yesterdayStart+",To:"+yesterdayEnd);
   	db.getAppTimeStamp(appGuangGao,yesterdayStart,yesterdayEnd,function(err,appData){
   		var sum=new summary();
   		logger.info('guangGaoDay Length '+appData.length);
   		//reportData.day=appData;
     	report.guangGaoDay=sum.getOptionGuangGao(appData);
     	logger.info("report.guangGaoDay:"+JSON.stringify(report.guangGaoDay));
  	});

   	db.getAppTimeStamp(appTotalOil,yesterdayStart,yesterdayEnd,function(err,appData){
   		var sum=new summary();
   		logger.info('totaloilDay Length '+appData.length);
   		//reportActData=appData;
    	report.totalOil=sum.getOptionTotalOil(appData,'Day');
    	logger.info("report.totalOil:"+JSON.stringify(report.totalOil));
  	});

 	//Week Range
	var weekStart=moment().locale('zh-cn').subtract(1,'weeks').startOf('week').valueOf();
	var weekEnd  =moment().locale('zh-cn').subtract(1,'weeks').endOf('week').valueOf();
   	db.getAppTimeStamp(appGuangGao,weekStart,weekEnd,function(err,appData){
   		var sum=new summary();
   		logger.info('guangGaoWeek Length '+appData.length);
     	report.guangGaoWeek=sum.getOptionGuangGao(appData);
     	logger.info("report.guangGaoWeek:"+JSON.stringify(report.guangGaoWeek));
  	});

 	//Month Range
	var monthStart=moment().subtract(1,'months').startOf('month').valueOf();
	var monthEnd  =moment().subtract(1,'months').endOf('month').valueOf();
   	db.getAppTimeStamp(appGuangGao,monthStart,monthEnd,function(err,appData){
   		var sum=new summary();
   		console.log('guangGaoMonth Length '+appData.length);
     	report.guangGaoMonth=sum.getOptionGuangGao(appData);
     	logger.info("report.guangGaoMonth:"+JSON.stringify(report.guangGaoMonth));
  	});	
 
}

function Schedule(database,app,logger){
	var app=app;
	var db = database;
　　 var rule = new schedule.RecurrenceRule();
　　 rule.minute = 1;

	app.get("/report", function(req, res) {
		res.send(report);
	});

	SummaryTask(db,logger);
	var j = schedule.scheduleJob(rule, function(){
		SummaryTask(db,logger);
	});
}

Schedule.prototype={

}

module.exports=Schedule;