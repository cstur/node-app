var db = require('../modules/mongodb.js');

exports.announceUpdate = function(req, res) {
	var doc = req.body||'';
	var tel = req.body.tel || '';
	var action = req.body.action || '';

	if (doc == '' || tel == '') {
		return res.sendStatus(400);
	}

	q={"tel":tel};
	db.Announce.findOne(q, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(401);
		}

		if (!user) { // Insert new user
			if (true) {}
			var announce = new db.Announce();
			announce.tel=doc.tel;
			announce.action=[];
			if (action!='') {
				announce.action.push(req.body.action);
			}

			announce.save(function(err) {
				if (err) {
					console.log(err);
					return res.sendStatus(500);
				}	
				return res.sendStatus(200);
			});
		}else{ // Update user
			if (action!='') {
				action.serverTime=new Date();
				db.Announce.update(q, {$push:{"action":action}}, {safe: true, upsert: true}, function(err, doc){
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					}	
					return res.sendStatus(200);
				});	
			}
		}
	});
}

exports.activeuser =function(req, res){
    var gte = req.query.gte||'';
    var lt = req.query.lt||''; 

	if (gte == '' || lt == '') {
		return res.sendStatus(400);
	}

    var dGte=new Date();
    dGte.setTime(gte);
    var dLt=new Date();
    dLt.setTime(lt);

	var q={"action.serverTime":{"$gte":dGte,"$lt":dLt}};

	db.Announce.count(q, function (err, c) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}

		if (c == undefined) {
			return res.sendStatus(401);
		}

		return res.json({count:c});
	});
}

exports.announceQuery = function(req, res) {
	var doc = req.body||'';
	var tel = req.body.tel || '';

	if (doc == '' || tel == '') {
		return res.sendStatus(400);
	}

	var q={tel:tel};

	db.Announce.findOne(q, function (err, doc) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}

		if (doc == undefined) {
			return res.sendStatus(401);
		}

		return res.json({doc:doc});
	});
}