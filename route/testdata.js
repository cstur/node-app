var db = require('../modules/mongodb.js');


exports.users = function(req, res) {
	db.TestData.findOne({}, function (err, doc) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}

		if (doc == undefined) {
			return res.sendStatus(401);
		}

		return res.json(doc);
	});
}