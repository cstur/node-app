var express    = require("express");

var app = express();

/*
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
*/

app.get("/getTestText", function(req, res) {
	res.send('ok');
});

var port = process.env.PORT || 8081;

app.listen(port, function() {
	console.log("Listening on " + port);
});