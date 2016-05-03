var express = require("express");
var bodyParser = require('body-parser');
var parser = require('ua-parser-js');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var collecAgent='agent';
var url = 'mongodb://localhost:27017/chezheng';

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});
var AgentSchema =  new mongoose.Schema({ua:mongoose.Schema.Types.Mixed,uid:String});
AgentSchema.plugin(timestamps);
var AgentModel = db.model('Agent',AgentSchema);

var AgentReportSchema =  new mongoose.Schema({
  browser:mongoose.Schema.Types.Mixed,
  deivce:mongoose.Schema.Types.Mixed,
  os:mongoose.Schema.Types.Mixed
});
AgentReportSchema.plugin(timestamps);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var texts='2';

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

require('./weixin.js').init(app);

app.get("/texts", function(req, res) {
	res.send(texts);
});

app.get("/agents", function(req, res) {
  AgentModel.find(function(err,agents){
    res.send(agents);
  });
});

app.post("/editText", function(req, res) {
	console.log('rece data:'+req.body.json);
	texts=req.body.json;
	res.send(texts);
});

app.post("/storeAgent", function(req, res) {
  console.log('rece data agent:'+req.body.json.agent);
  console.log('rece data uid:'+req.body.json.uid);
  var ua = parser(req.body.json.agent);
  console.log(ua);
  var data={ua:ua,uid:req.body.json.uid,app:req.body.json.app};

  var agentEntity = new AgentModel(data);
  agentEntity.save(); 
  res.send('ok');
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
	console.log("Listening on " + port);
});