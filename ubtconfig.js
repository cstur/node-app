var uuid = require('node-uuid');

function UBTConfig(app,item){
	app.post("/addItem", function(req, res) {
		var key=req.body.key;
		item.addItem({
			'index': uuid.v1(),
			'data': req.body
		},key);
		res.send(item.getItem(key));
	});

	app.post("/deleteItem", function(req, res) {
		var _index = req.body.index;
		var key=req.body.key;
		item.deleteItem(_index,key);
		res.send(item.getItem(key));
	});

	app.get("/ItemList", function(req, res) {
		var key=req.query.key;
		console.log('getList'+item.getItem(key));
		res.send(item.getItem(key));
	});
}

UBTConfig.prototype={

}

module.exports=UBTConfig;