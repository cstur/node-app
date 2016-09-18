db.getCollection('pvs').find({"pv.pvid":"vip"}).count()

db.getCollection('pvs').find({
    "pv.pvid":"vip",
    "pv.uid":{"$exists" : true, "$ne" : ""},
    "createdAt":{"$gte":ISODate(new Date(2016,8,7).toISOString()),"$lt":ISODate(new Date(2016,8,8).toISOString())}
})

db.getCollection('pvs').distinct("pv.tel",
{
    "pv.pvid":"vip",
    "pv.uid":{"$exists" : true, "$ne" : ""},
    "pv.tel":{"$exists" : true, "$ne" : ""},
    "createdAt":{"$gte":ISODate(new Date(2016,8,1).toISOString()),"$lt":ISODate(new Date(2016,8,18).toISOString())}
}).sort()

db.czconfig.insert({"name":"test doc"})
var doc=db.czconfig.findOne({"name":"test doc"})
doc.abc="gogogo"
db.czconfig.update({"_id":doc._id},doc)
db.czconfig.find({})