var express     = require("express"),
    bodyParser  = require('body-parser'),
    log4js      = require('log4js'),
    jwt         = require('express-jwt'),
    secret      = require('./config/secret'),
    redisClient = require('./modules/redis.database.js').redisClient;
    config      = require('./config/index.js');

log4js.configure({
  appenders: [
    { type: 'console' },
    {
      type: 'file',
      filename: 'logs/main.log', 
      maxLogSize: 1024*1024,
      backups:3,
      category: 'normal'
      //layout: {
        //type: 'pattern',
        //pattern: "{time:%d,data:%m}"
      //}
    }
  ]
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

/*
var limiter = require('express-limiter')(app, redisClient)
limiter({
  path: '*',
  method: 'all',
  lookup: ['connection.remoteAddress'],
  total: 100,
  expire: 1000 * 60,
  onRateLimited: function (req, res, next) {
    return res.sendSatus(400);
  }
});
*/

app.all('*',function (req, res, next) {
  //TODO wait for enviroment ready

  /*
  if (config.env!='pro') {
    res.header('Access-Control-Allow-Origin', '*');
  }else{
    res.header('Access-Control-Allow-Origin', 'r.ichezheng.com');
  }
  */
  res.header('Access-Control-Allow-Origin', '*');
  
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

app.get("/healthcheck", function(req,res){
  res.sendStatus(200);
});

var routes={};

routes.weixin = require('./route/weixin.js');
app.post('/weixin', routes.weixin.signature);

routes.ubt = require('./route/ubt.js');
/*
  For Native App
*/
app.post("/pv", routes.ubt.pv);
app.post("/pv-test", routes.ubt.pvtest);
/*
  For H5
*/
app.get("/pv.gif", routes.ubt.pvgif);
app.get("/pv-test.gif", routes.ubt.pvgifTest);
app.get("/q", routes.ubt.q);
app.get("/mr", routes.ubt.mr);

routes.users = require('./route/users.js');
app.post("/signin", routes.users.signin);
app.get("/logout", jwt({secret: secret.secretToken}), routes.users.logout);
app.post("/register", routes.users.register);
//app.get('/post/all', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.posts.listAll);

var port = process.env.NODE_PORT || 8080;

process.on('uncaughtException', function(err) {
    logger.error(err);
});

app.listen(port, function() {
	logger.info("Listening on " + port);
});
