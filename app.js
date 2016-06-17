var express     = require("express"),
    bodyParser  = require('body-parser'),
    log4js      = require('log4js'),
    jwt         = require('express-jwt'),
    secret      = require('./config/secret'),
    db          = require('./modules/mongodb.js'),
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
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: true,limit: '5mb', parameterLimit:50 }));
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

app.all('*',function (req, res, next) {

  if (config.env!='pro') {
    res.header('Access-Control-Allow-Origin', '*');
  }else{
    res.header('Access-Control-Allow-Origin', 'r.ichezheng.com');
  }
  
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    
    var accessLog = new db.accessLogModel();
    accessLog.log={url:req.url};
    accessLog.save();

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
  Deprecated
  just let app version <=4.1.4 work, delete if all user upgrade app
*/
app.get("/pv.gif", function(req,res){
  res.sendStatus(200);
});

/*
  For Native App
*/
app.post("/ubt/pv", routes.ubt.pv);
/*
  For H5
*/
app.get("/ubt/pv.gif", routes.ubt.pvgif);
app.get("/ubt/q", routes.ubt.q);

routes.mapreduce = require('./route/mr.js');
app.get("/ubt/mr", routes.mapreduce.mr);

routes.users = require('./route/users.js');
app.post("/users/signin", routes.users.signin);
app.get("/users/logout", jwt({secret: secret.secretToken}), routes.users.logout);
app.post("/users/register", routes.users.register);
app.get("/users/me", jwt({secret: secret.secretToken}),routes.users.me);

var port = process.env.NODE_PORT || 8080;

process.on('uncaughtException', function(err) {
    logger.error(err);
});

app.listen(port, function() {
	logger.info("Listening on " + port);
});
