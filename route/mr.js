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

	db.pvModel.count(queryParams, function(err, c) {
        if(err) res.sendStatus(500);
	    	
		if (taskid=="c") { //统计文档数量
			return res.json({count:c});
		}else{
			if (c>500000) {
				return res.sendStatus(411);
			}else if(taskid=="d"){ // distinct results
				if (field) {
					db.pvModel.find(queryParams).distinct(field, function(err, arr) {
						if(err) res.sendStatus(500);
		    			res.json({result:arr});
					});
				}else{
					res.sendStatus(400);
				}
			}else{
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
					if(err) res.sendStatus(500);
				    return res.json({processtime:stats.processtime,results:data});
				});
			}		
		}
    });
}