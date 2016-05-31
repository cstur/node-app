var express     = require("express"),
    bodyParser  = require('body-parser'),
    auth        = require('../authenticate/auth.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

new auth(app);

var port = process.env.PORT || 8080;

process.on('uncaughtException', function(err) {
  console.log(err);
});

app.listen(port, function() {
	console.log("Listening on " + port);
});