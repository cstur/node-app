var jwt   = require("jsonwebtoken");
var User  = require('../../models/User');

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

function Authenticate(app) {
    app.post('/authenticate', function(req, res) {
        User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                   res.json({
                        type: true,
                        data: user,
                        token: user.token
                    }); 
                } else {
                    res.json({
                        type: false,
                        data: "Incorrect email/password"
                    });    
                }
            }
        });
    });


    app.post('/signin', function(req, res) {
        User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    res.json({
                        type: false,
                        data: "User already exists!"
                    });
                } else {
                    var userModel = new User();
                    if (!req.body.email || !req.body.password || !req.body.username) {
                        res.json({
                            type: false,
                            data: "Error occured: not valid user data"
                        });
                    }else{
                        userModel.email = req.body.email;
                        userModel.password = req.body.password;
                        userModel.username = req.body.username;

                        userModel.save(function(err, user) {
                            user.token = jwt.sign(user, process.env.JWT_SECRET);
                            user.save(function(err, user1) {
                                res.json({
                                    type: true,
                                    data: user1,
                                    token: user1.token
                                });
                            });
                        });
                    }

                }
            }
        });
    });

    app.get('/me', ensureAuthorized, function(req, res) {
        User.findOne({token: req.token}, function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                res.json({
                    type: true,
                    data: user
                });
            }
        });
    });   
}

Authenticate.prototype={

}

module.exports=Authenticate;