
db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.click.0.ele.name":"applybutton"}).count()

db.getCollection('pvs').find({"pv.pvid":"mobile-home"}).count()

db.getCollection('pvs').find(
{
    "pv.pvid":"mobile-home",
    "createdAt":{"$gte":ISODate(new Date(2016,7,15,0,0,0).toISOString()) },
    "createdAt":{"$lte":ISODate(new Date(2016,7,15,23,59,59).toISOString()) },
}).count()

db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.pvid":"mobile-home",
        "createdAt":{"$gte":ISODate(new Date(2016,7,11).toISOString()),"$lt":ISODate(new Date(2016,7,16).toISOString())}
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
]);
    
db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.referrer":{"$ne":""}},{"pv.data.web.referrer":1}).map( function(u) { return u.pv.data.web.referrer; } );



