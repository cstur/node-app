var db = require('../modules/mongodb.js');
var mapreduce = require('../modules/mapreduce.js');

/*
	Map Reduce Task
*/
exports.mr = function(req, res){
	var period = req.query.period || 2;
	var taskid = req.query.taskid || 1;
	var field = req.query.field || "uid";
	var queryParams =  req.query.queryParams || "{}";
	queryParams=JSON.parse(queryParams);

	var o = {};

	if (taskid==1) {
		o = mapreduce.pvunique(period,queryParams,field);
	}
	else if (taskid==2) {
		o = mapreduce.convertion(queryParams);
	}
	else if (taskid==3) {
		o = mapreduce.pv(period,queryParams);
	}
	
	db.pvModel.mapReduce(o,function (err, data, stats) { 
		if(err) throw err;
	    res.json({processtime:stats.processtime,results:data});
	});
}