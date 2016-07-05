var fs = require('fs');
var crypto = require('crypto');

exports.sign = function(req, res) {
    var appKey="6BAA8939-1CB1-4CF3-BF31-46C6CE3DD545", 
    tenantId="chezheng.yunkefu.com", key;
    key = fs.readFileSync('private.pem')
    /*
    let appKeyQuery = req.query.appKey;
    if(!appKeyQuery){
        appKeyQuery = config.defaultApp;
    }
    let appConfig = config[appKeyQuery]; //load config
    appKey = appConfig.appKey;//appKey from unicall website
    tenantId = appConfig.tenantId;//tenantId
    key = appConfig.privateKey;//private key generated
    */

    var time = new Date().toISOString();
    var expireTime = 60000;//set the expire time for the signature to be 60 seconds
    var sign = crypto.createSign('RSA-SHA256');

    //sort parameters as string in alphabet order
    var map = new Map();
    map.set("time", time);
    map.set("appKey", appKey);
    map.set("tenantId",tenantId);
    map.set("expireTime",expireTime);
    var query = "";
    var arr = new Array();
    for (var k of map) {
        arr.push(k[0]);
    }
    arr.sort();
    //join parameters together as a url query
    for(var k of arr){
        query+="&"+k+"="+map.get(k);
    }
    if(query.length>0)
        query = query.substr(1);
    sign.update(query);
    //get signature
    var sig = sign.sign(key, 'hex');
    map.set("signature",sig);
    var obj= new Object();
    for(var k of map){
        obj[k[0]] = k[1];
    }
    res.json(obj);
    console.log(JSON.stringify(obj));
    console.log(JSON.stringify(query));
}
