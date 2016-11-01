/* 按钮点击 */
db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.click.0.ele.name":"applybutton"}).count()
db.getCollection('pvs').find({"pv.pvid":"m","pv.data.web.click.0.ele.name":"payorder"})
db.getCollection('pvs').find({"pv.app":"/.*ios*/"}).count()

db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.referrer":"http://mp.weixinbridge.com/mp/wapredirect?url=http%3A%2F%2Fm.ichezheng.com"})

db.getCollection('pvs').find({"pv.pvid":"ubao","pv.data.web.click":{ $elemMatch: { "ele.name": "getorder" } }}).count()
db.getCollection('pvs').distinct("pv.uid",{"pv.pvid":"ubao","pv.data.web.click":{ $elemMatch: { "ele.name": "getorder" } }})

db.getCollection('pvs').find({"pv.pvid":"mobile-home",$where: "this.pv.data.web.routes.length > 1","pv.uid":{"$ne": ""}}).count()
db.getCollection('pvs').find({"pv.pvid":"vip","pv.uid":{"$exists" : true, "$ne" : ""},"pv.tel":{"$exists" : true, "$ne" : ""}}).count()
db.getCollection('pvs').find({"pv.pvid":"mobile-home",$where: "this.pv.data.web.click.length > 1"}).count()

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
        "pv.pvid":"ubao",
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

db.getCollection('pvs').find({
    "pv.pvid":"vip_responsive",
    "pv.data.web.referrer":{"$exists" : true, "$ne" : ""}
 }).count()
db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.app":"cz",
        "pv.pvid":"vip_responsive",
        "createdAt":{"$gte":ISODate(new Date(2016,9,23).toISOString()),"$lt":ISODate(new Date(2016,9,24).toISOString())}
    } 
},
{ 
    $group : {
        _id:"$pv.data.web.page_url",
        count: { $sum: 1 }
    }
},
{ $sort: { _id: -1 } }
]);

db.getCollection('pvs').mapReduce( 
   function() { 
       emit(this.pv.data.web.page_url,1); 
   }, 
   function(key, values) {return Array.sum(values)}, 
      {  
         query:{"pv.pvid":"vip_responsive"},  
         out:"url_total" 
      }
).find()

db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.pvid":"mobile-home",
        "pv.data.web.referrer":{"$ne":""},
        "createdAt":{"$gte":ISODate(new Date(2016,5,17).toISOString()),"$lt":ISODate(new Date(2016,10,18).toISOString())}
    } 
},
{ 
    $group : {
        _id:"$pv.data.web.referrer",
        count: { $sum: 1 }
    }
},
{ $sort: { count: -1 } }
]);

db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.pvid":"mobile-home",
        "pv.data.web.referrer":{"$ne":""}
    } 
},
{ 
    $group : {
        _id:"$pv.data.web.referrer",
        count: { $sum: 1 }
    }
},
{ $sort: { _id: -1 } }
]);



db.getCollection('pvs').find({"pv.pvid":"mobile-home","pv.data.web.referrer":{"$ne":""}},{"pv.data.web.referrer":1}).map( function(u) { return u.pv.data.web.referrer; } );

db.getCollection('pvs').distinct("pv.pvid",{"pv.app":"cz","pv.ubt_client_type":"ios"}).sort()
db.getCollection('pvs').distinct("pv.tel",
{
    "pv.pvid":"vip",
    "pv.uid":{"$exists" : true, "$ne" : ""},
    "pv.tel":{"$exists" : true, "$ne" : ""}
}).sort()

db.getCollection('pvs').find({
    "pv.pvid":{$regex:"android"},
    "pv.data.android.click.0.id":{"$regex":".*APP_REWARD_AD-众安*"},
    "createdAt":{"$gte":ISODate(new Date(2016,9,18).toISOString()),"$lt":ISODate(new Date(2016,9,19).toISOString())}
    }).count();

db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.app":"cz",
        "pv.pvid":/.*android*/,
        "pv.data.android.click.0.id":{"$regex":".*APP_REWARD_AD-*"},
        "createdAt":{"$gte":ISODate(new Date(2016,9,1).toISOString()),"$lt":ISODate(new Date(2016,9,29).toISOString())}
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


db.getCollection('pvs').find({
    "pv.pvid":{$regex:"android"},
    "pv.data.android.click.0.id":{"$regex":".*APP_REWARD_AD-*"},
    "createdAt":{"$gte":ISODate(new Date(2016,7,18).toISOString()),"$lt":ISODate(new Date(2016,9,20).toISOString())}
    }).count();


