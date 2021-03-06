var db = require('../modules/mongodb.js');
var log4js = require('log4js');
var logger = log4js.getLogger('normal');
/*
	Query PV
*/
exports.q = function(req, res){
    var page = req.query.page || 1;
    var pageSize = req.query.pageSize || 10;
    var populate =  req.query.populate || '';
    var queryParams =  req.query.queryParams || "{}";
    queryParams=JSON.parse(queryParams);
    
    var sortParams = req.query.sortParams || "{}";

    var docName = req.query.docName || 'PV';
    var model = db.pvModel;
    if (docName=='PV') {
    	model = db.pvModel;
    }else if (docName=='AccessLog') {
    	model = db.accessLogModel;
    }

    page= Math.abs(page);
    pageSize= Math.abs(pageSize);
    if (pageSize>999) {
    	return res.sendStatus(400);
    }
    db.pageQuery(page, pageSize, model, populate, queryParams, sortParams, function(error, $page){
        if(error){
            return res.sendStatus(500);
        }else{
            res.json({
                records: $page.results,
                pageCount: $page.pageCount,
                totalSize: $page.totalSize
            })
        }
    });
}

/* Save PV */
function savePV(pv,res){
	pv.save(function(err) {
		if (err) {
            console.log(err);
			return res.sendStatus(500);
		}	
		return res.sendStatus(200);
	});
}

exports.pv = function(req, res) {
    try{
        //var queryStr=req.query.pv || '';
        var pvData=req.body || "{}";

        if (pvData == "{}") {
            return res.sendStatus(400);
        }

        //var pvData = JSON.parse(queryStr);
        var pv = new db.pvModel();
        pv.pv=pvData;
        
        savePV(pv,res);
    }catch(e){
        logger.error(e);
        return res.sendStatus(500);
    }
}

exports.pvgif = function(req, res) {
    try {
        var queryStr=require('url').parse(req.url).query || '';

        if (queryStr == '') {
            return res.sendStatus(400);
        }
        var pvData = JSON.parse(decodeURIComponent(queryStr));
        var pv = new db.pvModel();
        pv.pv=pvData;

        savePV(pv,res);
    } catch (e) {
        logger.error(e);
        return res.sendStatus(500);
    }
}

exports.pverror = function(req, res) {
    try {
        var queryStr=require('url').parse(req.url).query || '';

        if (queryStr == '') {
            return res.sendStatus(400);
        }
        var pvData = JSON.parse(decodeURIComponent(queryStr));
        var pv = new db.pvErrorModel();
        pv.pv=pvData;

        savePV(pv,res);
    } catch (e) {
        logger.error(e);
        return res.sendStatus(500);
    }
}

function aggregateCallback(err,result){
    if (err) {return res.sendStatus(500);}
    res.json(result);
}

exports.distinct =function(req, res){
    var gte = req.query.gte||'';
    var lt = req.query.lt||''; 
    var script = req.query.script||'';//聚合脚本名
    var pageName = req.query.pageName||'';

    if (gte == ''||lt == ''||script==''||pageName == '') {
        return res.sendStatus(400);
    }
        
    var dGte=new Date();
    dGte.setTime(gte);
    var dLt=new Date();
    dLt.setTime(lt);

    if (script=="fingerprint") {
        db.pvModel.find({
            "pv.pvid":"vip_responsive",
            "pv.data.web.page_url":{$regex:pageName},
            "pv.fingerprint":{"$exists" : true, "$ne" : ""},
            "createdAt":{"$gte":dGte,"$lt":dLt}
        }).distinct('pv.fingerprint', function(err, fingerprints) {
            if (err) {return res.sendStatus(500);}
            res.json(fingerprints);
        });
    }else if(script=="tel"){
        db.pvModel.find({
            "pv.pvid":"vip_responsive",
            "pv.data.web.page_url":{$regex:pageName},
            "pv.tel":{"$exists" : true, "$ne" : ""},
            "createdAt":{"$gte":dGte,"$lt":dLt}
        }).distinct('pv.tel', function(err, tels) {
            if (err) {return res.sendStatus(500);}
            res.json(tels);
        });
    }else{
        return res.sendStatus(400);
    }
}

exports.aggre =function(req, res){
    var gte = req.query.gte||'';
    var lt = req.query.lt||''; 
    var script = req.query.script||'';//聚合脚本名
    var regPVID = req.query.regPVID||'';

    if (gte == ''||lt == ''||script==''||regPVID == '') {
        return res.sendStatus(400);
    }
        
    var dGte=new Date();
    dGte.setTime(gte);
    var dLt=new Date();
    dLt.setTime(lt);

    if (script=="groupByTime") {
        db.pvModel.aggregate([
                { 
                    $match: {
                        "pv.pvid":{$regex:regPVID},
                        "createdAt":{"$gte":dGte,"$lt":dLt}
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
                { $sort: { _id: 1 } }
            ],
            function (err,result){
                if (err) {return res.sendStatus(500);}
                res.json(result);
            }
        );      
    }else if (script=="groupByPVID") {
        db.pvModel.aggregate([
                { 
                    $match: {
                        "pv.app":"cz",
                        "pv.pvid":{$regex:regPVID},
                        "createdAt":{"$gte":dGte,"$lt":dLt}
                    } 
                },
                { 
                    $group : {
                        _id:"$pv.pvid",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ],
            function (err,result){
                if (err) {return res.sendStatus(500);}
                res.json(result);
            }
        );
    }else if (script=="groupByReferrer") {
        db.pvModel.aggregate([
                { 
                    $match: {
                        "pv.pvid":{$regex:regPVID},
                        "pv.data.web.referrer":{"$ne":""},
                        "createdAt":{"$gte":dGte,"$lt":dLt}
                    } 
                },
                { 
                    $group : {
                        _id:"$pv.data.web.referrer",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ],
            function (err,result){
                if (err) {return res.sendStatus(500);}
                res.json(result);
            }
        );
    }else if (script=="groupByPageURL") {
        db.pvModel.aggregate([
                { 
                    $match: {
                        "pv.pvid":{$regex:regPVID},
                        "pv.data.web.page_url":{"$ne":""},
                        "createdAt":{"$gte":dGte,"$lt":dLt}
                    } 
                },
                { 
                    $group : {
                        _id:"$pv.data.web.page_url",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ],
            function (err,result){
                if (err) {return res.sendStatus(500);}
                res.json(result);
            }
        );
    }else if (script=="groupByUA") {
        db.pvModel.aggregate([
                { 
                    $match: {
                        "pv.pvid":{$regex:regPVID},
                        "pv.data.web.ua":{"$ne":""},
                        "createdAt":{"$gte":dGte,"$lt":dLt}
                    } 
                },
                { 
                    $group : {
                        _id:"$pv.data.web.ua",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ],
            function (err,result){
                if (err) {return res.sendStatus(500);}
                res.json(result);
            }
        );
    }else{
        return res.sendStatus(400);
    }

}

