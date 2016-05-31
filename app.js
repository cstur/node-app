var express     = require("express"),
    bodyParser  = require('body-parser'),
    morgan      = require("morgan"),
    report      = require('./modules/report/report.js'),
    items       = require('./app.items.js'),
    auth        = require('./modules/authenticate/auth.js'),
    schedule    = require('./modules/schedule/schedule.js'),
    database    = require('./modules/db/mongodb.js'),
    ubtconfig   = require('./config/ubtconfig.js');

var item= new items();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

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
var db=new database();
new report(app,item,db);
new ubtconfig(app,item);
new auth(app);
new schedule(db,app);

app.post("/editText", function(req, res) {
	texts=req.body.json;
	res.send(texts);
});

var port = process.env.PORT || 8080;

process.on('uncaughtException', function(err) {
    console.log(err);
});

app.listen(port, function() {
	console.log("Listening on " + port);
});