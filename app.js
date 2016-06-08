var express     = require("express"),
    bodyParser  = require('body-parser'),
    morgan      = require("morgan"),
    report      = require('./modules/report/report.js'),
    items       = require('./app.items.js'),
    auth        = require('./modules/authenticate/auth.js'),
    schedule    = require('./modules/schedule/schedule.js'),
    database    = require('./modules/db/mongodb.js'),
    ubtconfig   = require('./config/ubtconfig.js'),
    log4js      = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
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

var item= new items();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

app.all('*',function (req, res, next) {
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

require('./modules/weixin/weixin.js').init(app);
var db=new database(logger);
new report(app,item,db,logger);
new ubtconfig(app,item,logger);
new auth(app,logger);
new schedule(db,app,logger);

app.post("/editText", function(req, res) {
	texts=req.body.json;
	res.send(texts);
});

app.post("/pv", function(req, res) {
  var json=req.body;
  var appName=json.app;
  var data={app:appName,data:json};
  db.saveApp(data);
  res.send('200');
});

app.post("/pv-test", function(req, res) {
  var json=req.body;
  var appName=json.app;
  appName=appName+'-test';
  var data={app:appName,data:json};
  db.saveApp(data);
  res.send('200');
});

app.get("/q", function(req, res) {
  db.queryByTimeStamp(
    req.query.gte,
    req.query.lte,
    req.query.limit,
    req.query.page,
    function(err,appData){
      res.send(appData);
    });
});

app.get("/qCount", function(req, res) {
  db.qCount(
    req.query.gte,
    req.query.lte,
    res);
});

var port = process.env.PORT || 8080;

process.on('uncaughtException', function(err) {
    logger.info(err);
});

app.listen(port, function() {
	logger.info("Listening on " + port);
});