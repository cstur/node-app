var db = require('../modules/mongodb.js');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var redisClient = require('../modules/redis.database').redisClient;
var tokenManager = require('../modules/token.manager');

exports.signin = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
	
	if (username == '' || password == '') { 
		return res.sendStatus(401); 
	}

	db.userModel.findOne({username: username}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(401);
		}

		if (user == undefined) {
			return res.sendStatus(401);
		}
		
		user.comparePassword(password, function(isMatch) {
			if (!isMatch) {
				console.log("Attempt failed to login with " + user.username);
				return res.sendStatus(401);
            }

			var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
			
			return res.json({token:token,user:user});
		});

	});
};

exports.logout = function(req, res) {
	if (req.user) {
		tokenManager.expireToken(req.headers);

		delete req.user;	
		return res.sendStatus(200);
	}
	else {
		return res.sendStatus(401);
	}
}

exports.register = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
	var passwordConfirmation = req.body.passwordConfirmation || '';

	if (username == '' || password == '' || password != passwordConfirmation) {
		return res.sendStatus(400);
	}

	var user = new db.userModel();
	user.username = username;
	user.password = password;

	user.save(function(err) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}	
		
		return res.sendStatus(200);
	});
}