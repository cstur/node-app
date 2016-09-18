db.getCollection('czconfig').find({})

/* 插入 */
db.getCollection('czconfig').insert({
    "url":"r.ichezheng.com",
    "pageview":"22"
})

/* 替换 */
var ichezheng=db.czconfig.findOne({"pageview":"22"});
ichezheng.url="vipchexian.com";
//delete ichezheng.url;
db.czconfig.update({"pageview":"22"},ichezheng)

/* 修改器 */
/* $set $unset */
db.czconfig.update({"url":"vipchexian.com"},{"$set":{"routes.home":"首页"}})
db.czconfig.update({"url":"vipchexian.com"},{"$unset":{"name":1}})

/* $inc */
db.czconfig.update({"url":"vipchexian.com"},{"$inc":{"pageview":1}})

/* $push */
db.czconfig.update({"url":"vipchexian.com"},
{
    "$push":{
        "comments":{
            "title":"abc1",
            "mail":"sdongjie2@126.com",
            "content":"badfff ... "
         }
     }
})
db.czconfig.update({"comments.title":"abc1"},
{
    "$set":{
        "comments.$.name":"sky2"
     }
})
db.getCollection('czconfig').find({"url":"vipchexian.com"})