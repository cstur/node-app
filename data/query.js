/* 按钮点击 */
db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.click.0.ele.name":"applybutton"}).count()
db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.click.0.ele.name":"applybutton"})
db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.click":{ $elemMatch: { "ele.name": "payorder" } }}).count()

db.getCollection('pvs').find({"pv.pvid":"mobile-home",$where: "this.pv.data.web.routes.length > 1","pv.uid":{"$ne": ""}}).count()

db.getCollection('pvs').find({"pv.pvid":"mobile-home","this.pv.data.web.routes":{"$exists" : true},$where: "this.pv.data.web.routes.length > 1"})
db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.routes":{"$exists" : true},$where: "this.pv.data.web.routes.length > 1"})


db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.routes.0.toState.name":"entry.index"}).count()

db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.uid":{"$exists" : true, "$ne" : ""}})

db.getCollection('pvs').find({"pv.pvid":"mobile-home"}).count()

db.getCollection('pvs').find(
{
    "pv.pvid":"mobile-home",
    "createdAt":{"$gte":ISODate(new Date(2016,7,18,11,0,0).toISOString()),"$lte":ISODate(new Date(2016,7,18,23,59,59).toISOString()) }
}).count()

db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.pvid":"mobile-home",
        "createdAt":{"$gte":ISODate(new Date(2016,7,11).toISOString()),"$lt":ISODate(new Date(2016,7,26).toISOString())}
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

db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.app":"cz",
        "pv.pvid":/.*ios*/,
        "createdAt":{"$gte":ISODate(new Date(2016,7,1).toISOString()),"$lt":ISODate(new Date(2016,7,29).toISOString())}
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

db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.app":"cz",
        "pv.pvid":{$regex:"ios-4.2.1"},
        "createdAt":{"$gte":ISODate(new Date(2016,7,17).toISOString()),"$lt":ISODate(new Date(2016,7,18).toISOString())}
    } 
},
{ 
    $group : {
        _id:"$pv.pvid",
        count: { $sum: 1 }
    }
},
{ $sort: { _id: -1 } }
]);


db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.referrer":{"$ne":""}},{"pv.data.web.referrer":1}).map( function(u) { return u.pv.data.web.referrer; } );

db.getCollection('pvs').distinct("pv.pvid",{"pv.app":"cz"}).sort()

db.getCollection('pvs').find({"pv.pvid":{$regex:"ios-4.2.1"}});


