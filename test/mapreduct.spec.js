var mapreduce = require('../modules/mapreduce.js');
var db        = require('../modules/mongodb.js');

var o = {};
var taskid = 2;
var queryParams = {"pv.pvid":"abc"};
var period=1;

if (taskid==1) {
	o = mapreduce.pvuv(queryParams);
}
else if (taskid==2) {
	o = mapreduce.convertion(queryParams);
}

db.pvModel.mapReduce(o,function (err, data, stats) { 
	if(err) throw err;
	console.log(stats.processtime);
	console.log(data);
});