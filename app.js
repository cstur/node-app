var express     = require("express"),
    bodyParser  = require('body-parser'),
    log4js      = require('log4js'),
    jwt         = require('express-jwt'),
    secret      = require('./config/secret'),
    db          = require('./modules/mongodb.js'),
    request     = require('request'),
    //heapdump    = require('heapdump'),
    path    = require('path'),
    config      = require('./config/index.js');

console.log("current env:"+config.env);

log4js.configure({
  appenders: [
    { type: 'console' },
    {
      type: 'file',
      filename: config.logPath, 
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

var app = express();
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true,limit: '10mb', parameterLimit:50 }));

if (config.env=='pro') {
  logger.setLevel('WARN');
  //app.use(log4js.connectLogger(logger, {level:log4js.levels.WARN}));
}else{
  logger.setLevel('INFO');
  app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
}


app.all('*',function (req, res, next) {

  //if (config.env!='pro') {
  res.header('Access-Control-Allow-Origin', '*');
  //}else{
    //res.header('Access-Control-Allow-Origin', 'r.ichezheng.com');
  //}
  
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    
    /* 暂时停止访问日志
    var accessLog = new db.accessLogModel();
    accessLog.log={url:req.url};
    accessLog.save();
    */
    next();
  }
});

app.get("/healthcheck", function(req,res){
  res.sendStatus(200);
});

var routes={};

//if (config.env=='pro') {
routes.weixin = require('./route/weixin.js');
app.post('/weixin', routes.weixin.signature);
app.get('/weixin/validateToken', routes.weixin.validateToken);
app.get('/weixin/getUserInfo', routes.weixin.getUserInfo);
app.get('/weixin/auth', routes.weixin.auth);
app.get('/weixin/callback', routes.weixin.callback);
  //routes.wxlaoyou = require('./route/weixin.laoyou.js');
  //app.post('/wxlaoyou', routes.wxlaoyou.signature);
//}

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
app.get("/ubt/error.gif", routes.ubt.pverror);
app.get("/ubt/q", routes.ubt.q);
app.get("/ubt/aggre", routes.ubt.aggre);
app.get("/ubt/distinct", routes.ubt.distinct);

routes.mapreduce = require('./route/mr.js');
app.get("/ubt/mr", routes.mapreduce.mr);

routes.users = require('./route/users.js');
app.post("/users/signin", routes.users.signin);
app.get("/users/logout", jwt({secret: secret.secretToken}), routes.users.logout);
app.post("/users/register", routes.users.register);
app.get("/users/me", jwt({secret: secret.secretToken}),routes.users.me);

routes.announce = require('./route/announce.js');
app.post("/announce/update", routes.announce.announceUpdate);
app.post("/announce/query", routes.announce.announceQuery);
app.get("/announce/activeuser", routes.announce.activeuser);
app.get("/announce/aggreFriendlyName", routes.announce.aggreFriendlyName);

routes.shorten = require('./route/shorten.js');
app.post("/shorten", routes.shorten.shorten);
app.get("/s/:encoded_id", routes.shorten.redirect);

routes.kefu = require('./route/kefu.js');
app.get("/kefu", routes.kefu.sign);

app.get("/data/:filename",function(req,res){
  var filename = req.params.filename;
  res.sendFile(path.normalize(__dirname + '/data/'+filename));
});

app.get("/data/uploadimages/:filename",function(req,res){
  var filename = req.params.filename;
  res.sendFile(path.normalize(__dirname + '/data/uploadimages/'+filename));
});

routes.images = require('./route/images.js');
app.post('/img/upload', routes.images.uploadImage);

app.get("/broadcast", function(req,res){
  var msg=req.query.msg;
  wss.broadcast(msg);
  res.sendStatus(200);
});

var port = process.env.NODE_PORT || 8080;

process.on('uncaughtException', function(err) {
    logger.error(err);
});

app.listen(port, function() {
	logger.info("Listening on " + port);
});

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8001 });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    console.log('send');
    client.send(data);
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws) client.send(data);
    });
  });
  ws.on("close", function (code, reason) {
      console.log("Connection closed")
  });
});

/*
var ws = require("nodejs-websocket")
var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text", function (str) {
        console.log("Received "+str)
        conn.sendText(str.toUpperCase()+"!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)
*/
//heapdump.writeSnapshot();
