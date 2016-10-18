db.getCollection('pvs').find({"pv.pvid":"vip"}).count()

db.getCollection('pvs').find({
    "pv.pvid":"vip",
    "pv.data.web.page_url":{$regex:"sid=44"},
    "createdAt":{"$gte":ISODate(new Date(2016,9,12).toISOString()),"$lt":ISODate(new Date(2016,9,13).toISOString())}
}).count()

db.getCollection('pvs').find({
    "pv.pvid":"vip",
    "createdAt":{"$gte":ISODate(new Date(2016,9,9).toISOString()),"$lt":ISODate(new Date(2016,9,10).toISOString())}
}).count()

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

db.getCollection('pverrors').find({
      "createdAt":{"$gte":ISODate(new Date(2016,8,23,15,10,10).toISOString()),"$lt":ISODate(new Date(2016,8,25).toISOString())}  
    },
  {"pv.data":1}  
    ).count()