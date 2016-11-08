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

exports.announceQuery = function(req, res) {
	var doc = req.body||'';
	var tel = req.body.tel || '';
	var openid = req.body.openid || '';

	if (doc == '' || (tel == ''&&openid=='')) {
		return res.sendStatus(400);
	}

	var q={};
	if (tel=='') {
		q={openid:openid};
	}else{
		q={tel:tel};
	}

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