var express = require("express");
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

function health(err, resp) {
	if (err) {
		console.error(err.message);
	} else {
		console.dir(resp);
	}
}

client.cluster.health(health);

function error_handle(err, resp){
	
}

var doc1=
{
	index: 'blog',
	type: 'post',
	id: 1,
	body: {
		title: 'JavaScript Everywhere!',
		content: 'It all started when...',
		date: '2013-12-17'
	}
};

client.index(doc1, error_handle);

function search_callback(resp) {
	var hits = resp.body.hits;
	console.log(hits);
}

var doc_search={
	index: 'users',
	size: 50,
	body: {
	 	query: {
	 		match: {
	 			profile: 'elasticsearch'
			}
		}
	}	
};

client.search(doc_search).then(search_callback);




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