//整站PV
db.getCollection('pvs').find({
    "pv.pvid":"vip_responsive",
    "createdAt":{"$gte":ISODate(new Date(2016,10,22).toISOString()),"$lt":ISODate(new Date(2016,10,23).toISOString())}
 }).count()

//注册用户单页UV
db.getCollection('pvs').distinct("pv.tel",{
    "pv.pvid":"vip_responsive",
    "pv.data.web.page_url":{"$regex":".*product/orderList.html*"},
    "pv.tel":{"$exists" : true, "$ne" : ""},
    "createdAt":{"$gte":ISODate(new Date(2016,10,22).toISOString()),"$lt":ISODate(new Date(2016,10,23).toISOString())}
}).length
//非注册用户单页UV
db.getCollection('pvs').distinct("pv.fingerprint",{
    "pv.pvid":"vip_responsive",
    "pv.data.web.page_url":{"$regex":".*product/orderList.html*"},
    "pv.fingerprint":{"$exists" : true, "$ne" : ""},
    "createdAt":{"$gte":ISODate(new Date(2016,10,22).toISOString()),"$lt":ISODate(new Date(2016,10,23).toISOString())}
}).length
 
//注册用户活跃数
db.getCollection('announces').find({
    "tel":{"$exists" : true, "$ne" : ""},
    "action":{$elemMatch:{serverTime:{"$gte":ISODate(new Date(2016,10,21).toISOString()),"$lt":ISODate(new Date(2016,10,22).toISOString())}}}
}).count()

//非注册用户活跃数
db.getCollection('announces').find({
    "fingerprint":{"$exists" : true, "$ne" : ""},
    "action":{$elemMatch:{serverTime:{"$gte":ISODate(new Date(2016,10,21).toISOString()),"$lt":ISODate(new Date(2016,10,22).toISOString())}}}
}).count()

//分页PV统计
db.getCollection('pvs').aggregate([
{ 
    $match: {
        "pv.app":"cz",
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

//按钮文字查找点击  
db.getCollection('announces').find({
    "action.data.click.friendlyName":"报名-选择险种页-下一步按钮",
    "action":{$elemMatch:{serverTime:{"$gte":ISODate(new Date(2016,10,22).toISOString()),"$lt":ISODate(new Date(2016,10,23).toISOString())}}}
}).count()


//按钮文字查找点击  
db.getCollection('announces').find({
    "action.data.click.friendlyName":"登录弹窗-登录按钮",
    "action":{$elemMatch:{serverTime:{"$gte":ISODate(new Date(2016,10,22).toISOString()),"$lt":ISODate(new Date(2016,10,23).toISOString())}}}
}).count()

//按钮ID查找点击  
db.getCollection('announces').find({
    "action.data.click.id":"saveMsg",
    "action":{$elemMatch:{serverTime:{"$gte":ISODate(new Date(2016,10,21).toISOString()),"$lt":ISODate(new Date(2016,10,22).toISOString())}}}
}).count()

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

