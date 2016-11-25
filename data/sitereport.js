//整站PV
db.getCollection('pvs').find({
    "pv.pvid":"vip_responsive",
    "createdAt":{"$gte":ISODate(new Date(2016,10,25).toISOString()),"$lt":ISODate(new Date(2016,10,30).toISOString())}
 }).count()
 
db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.pvid":"vip_responsive",
        "createdAt":{"$gte":ISODate(new Date(2016,10,1).toISOString()),"$lt":ISODate(new Date(2016,10,30).toISOString())}
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


//注册用户单页UV
db.getCollection('pvs').distinct("pv.tel",{
    "pv.pvid":"vip_responsive",
    "pv.data.web.page_url":{"$regex":".*product/paysuccess.html*"},
    "pv.tel":{"$exists" : true, "$ne" : ""},
    "createdAt":{"$gte":ISODate(new Date(2016,10,24).toISOString()),"$lt":ISODate(new Date(2016,10,25).toISOString())}
}).length
//非注册用户单页UV
db.getCollection('pvs').distinct("pv.fingerprint",{
    "pv.pvid":"vip_responsive",
    "pv.data.web.page_url":{"$regex":".*product/paysuccess.html*"},
    "pv.fingerprint":{"$exists" : true, "$ne" : ""},
    "createdAt":{"$gte":ISODate(new Date(2016,10,23).toISOString()),"$lt":ISODate(new Date(2016,10,24).toISOString())}
}).length
 
//注册用户活跃数
db.getCollection('announces').find({
    "tel":{"$exists" : true, "$ne" : ""},
    "action":{$elemMatch:{serverTime:{"$gte":ISODate(new Date(2016,10,24).toISOString()),"$lt":ISODate(new Date(2016,10,25).toISOString())}}}
}).count()

//非注册用户活跃数
db.getCollection('announces').find({
    "fingerprint":{"$exists" : true, "$ne" : ""},
    "action":{$elemMatch:{serverTime:{"$gte":ISODate(new Date(2016,10,24).toISOString()),"$lt":ISODate(new Date(2016,10,25).toISOString())}}}
}).count()

//分页PV统计
db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.pvid":"vip_responsive",
        "createdAt":{"$gte":ISODate(new Date(2016,10,22).toISOString()),"$lt":ISODate(new Date(2016,10,23).toISOString())}
    } 
},
{ 
    $group : {
        _id:"$pv.data.web.page_url",
        count: { $sum: 1 }
    }
},
{ $sort: { count: -1 } }
]);

//渠道查询
db.getCollection('pvs').fid({
        "pv.pvid":"vip_responsive",
        "pv.data.web.page_url":{"$regex":".*sid=314$"},
        "createdAt":{"$gte":ISODate(new Date(2016,10,1).toISOString()),"$lt":ISODate(new Date(2016,10,23).toISOString())}   
}).count();
      
db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.data.web.page_url":{"$regex":".*sid=msg$"},
        "pv.pvid":"vip_responsive",
        "createdAt":{"$gte":ISODate(new Date(2016,10,1).toISOString()),"$lt":ISODate(new Date(2016,10,23).toISOString())}
    } 
},
{ 
    $group : {
        _id:"$pv.data.web.page_url",
        count: { $sum: 1 }
    }
},
{ $sort: { count: -1 } }
]);

//按钮文字查找点击  
db.getCollection('announces').find({
    "action.data.click.friendlyName":"报名-选择险种页-下一步按钮",
    "action":{$elemMatch:{serverTime:{"$gte":ISODate(new Date(2016,10,22).toISOString()),"$lt":ISODate(new Date(2016,10,23).toISOString())}}}
}).count()


//按钮ID查找点击
//老司机id getTrail
db.getCollection('announces').find({
    "action.data.click.id":"getTrail",
    "action.data.click.page":{"$regex":".*xiaobai.html*"},
    "action":{$elemMatch:{serverTime:{"$gte":ISODate(new Date(2016,10,1).toISOString()),"$lt":ISODate(new Date(2016,10,22).toISOString())}}}
}).count()

db.getCollection('announces').aggregate([
{ $unwind : "$action" },
{ 
    $match: {
        "action.serverTime":{ "$exists": true, "$ne": null },
        "action.data.click.page":{"$regex":".*xiaobai.html*"},
        "action.data.click.id":"getTrail"
    } 
},
{ 
    $group : {
        _id: {
            year : { $year : {$add:['$action.serverTime',28800000]} },          
            month : { $month : {$add:['$action.serverTime',28800000]} },        
            day : { $dayOfMonth : {$add:['$action.serverTime',28800000]} }
        },
        count: { $sum: 1 }
    }
},
{ $sort: { _id: -1 } }
]);

db.getCollection('announces').aggregate([
{ $unwind : "$action" },
{ 
    $match: {
        "action.serverTime":{ "$exists": true, "$ne": null },
        "action.data.click.page":{"$regex":".*laosiji.html*"},
        "action.data.click.id":"getTrail"
    } 
},
{ 
    $group : {
        _id: {
            year : { $year : {$add:['$action.serverTime',28800000]} }
        },
        count: { $sum: 1 }
    }
},
{ $sort: { _id: -1 } }
]);

//所有按钮 
db.getCollection('announces').aggregate([
{ $unwind : "$action" },
{
    "$match": {
        "action.data.click.friendlyName": { "$exists": true, "$ne": null },
        "action.data.click.friendlyName": { "$exists": true, "$ne": "" }
    }
},
{ 
    $group : {
        _id:"$action.data.click.friendlyName"
    }
},
{ $sort: { _id: -1 } }
]);

//历史文档数
db.getCollection('announces').find({}).count()