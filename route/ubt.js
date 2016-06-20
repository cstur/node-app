var db = require('../modules/mongodb.js');

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
			return res.sendStatus(500);
		}	
		
		return res.sendStatus(200);
	});
}

exports.pv = function(req, res) {
	//var queryStr=req.query.pv || '';
    var queryStr=req.body.pv || {};

	if (queryStr == '') {
		return res.sendStatus(400);
	}

	var pvData = JSON.parse(queryStr);
	var pv = new db.pvModel();
	pv.pv=pvData;

	savePV(pv,res);
}

exports.pvgif = function(req, res) {
	var queryStr=require('url').parse(req.url).query || '';

	if (queryStr == '') {
		return res.sendStatus(400);
	}

	var pvData = JSON.parse(decodeURIComponent(queryStr));
	var pv = new db.pvModel();
	pv.pv=pvData;

	savePV(pv,res);
}

