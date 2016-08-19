var mapreduce = require('../modules/mapreduce.js');
var db        = require('../modules/mongodb.js');
var moment  = require('moment');

var gte=moment().subtract(5,'days').valueOf();
var lt=moment().valueOf();
var start=new Date();
start.setTime(gte);
var end=new Date();
end.setTime(lt);

var script1=[
{ 
    $match: {
        "pv.pvid":"mobile-home",
        "createdAt":{"$gte":new Date(2016,7,12),"$lt":new Date(2016,7,17)}
    } 
},
{ 
    $group : {
        _id: {
            year : { $year : {$add:['$createdAt',28800000]} },          
            month : { $month : {$add:['$createdAt',28800000]} },        
            day : { $dayOfMonth : {$add:['$createdAt',28800000]} }
        },
        count: { $sum: 1 }
    }
},
{ $sort: { _id: -1 } }
];

var script2=[
{ 
    $match: {
        "pv.app":"cz",
        "pv.pvid":{$regex:"ios-4.2.0"},
        "createdAt":{"$gte":new Date(2016,5,12),"$lt":new Date(2016,7,17)}
    } 
},
{ 
    $group : {
        _id:"$pv.pvid",
        count: { $sum: 1 }
    }
},
{ $sort: { _id: -1 } }
];
var cursor = db.pvModel.aggregate(script2,
function(err,result) {
	console.log("err:"+err);
   	console.log("result:");
   	console.log(result);
}
);