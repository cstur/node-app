var express = require("express");
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var texts=['abc','abc'];

app.get("/texts", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.send(texts);
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
	console.log("Listening on " + port);
});