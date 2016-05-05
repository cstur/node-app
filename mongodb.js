var MongoClient = require('mongodb').MongoClient,
	assert      = require('assert'),
    mongoose    = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
	config      = require('./config/db.cfg.js');

function Database(){
	mongoose.connect(config.connStr);
	this.db = mongoose.connection;
	this.db.on('error', console.error.bind(console, 'connection error:'));
	this.db.once('open', function() {
		console.log('open mongodb');
	});
	this.AppSchema =  new mongoose.Schema({app:String,data:mongoose.Schema.Types.Mixed});
	this.AppSchema.plugin(timestamps);
	this.AppModel = this.db.model('AppModel',this.AppSchema);
}

Database.prototype={
	offset:0,

	saveApp : function(data){
  		var appEntity = new this.AppModel(data);
  		console.log('save:'+JSON.stringify(data));
  		appEntity.save(); 
	},

	getApp : function(appid,gte,lte,callback){
		console.log("gte:"+lte);
		console.log("new gte:"+new Date(lte));
		console.log("parse gte:"+Date.parse(lte));
		
		var option={app:appid,updatedAt:{'$gte':new Date(gte),'$lte':new Date(lte)}};
		console.log(option);
		this.AppModel.find(option,callback);
	}
}

module.exports=Database;