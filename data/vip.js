db.getCollection('pvs').find({"pv.pvid":"vip"}).count()

db.getCollection('pvs').distinct("pv.tel",
{
    "pv.pvid":"vip",
    "pv.uid":{"$exists" : true, "$ne" : ""},
    "pv.tel":{"$exists" : true, "$ne" : ""},
    "createdAt":{"$gte":ISODate(new Date(2016,8,4).toISOString()),"$lt":ISODate(new Date(2016,8,5).toISOString())}
}).sort()

