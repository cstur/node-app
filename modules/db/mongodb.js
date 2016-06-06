var MongoClient = require('mongodb').MongoClient,
	assert      = require('assert'),
    mongoose    = require('mongoose'),
    timestamps  = require('mongoose-timestamp'),
    AppModel    = require('../../models/AppModel');
	config      = require('../../config/db.cfg.js');
	//redisClient = require('redis').createClient,
    //redis       = redisClient(6379, 'localhost');

function Database(logger){
	mongoose.connect(config.connStr);
	this.db = mongoose.connection;
	this.db.on('error', console.error.bind(console, 'connection error:'));
	this.db.once('open', function() {
		console.log('open mongodb');
	});
	this.log=logger;
}

Database.prototype={

	saveApp : function(data){
  		var appEntity = new AppModel(data);
  		console.log('save:'+JSON.stringify(data));
  		appEntity.save(); 
	},

	getApp : function(appid,gte,lte,callback){
		var option={app:appid,updatedAt:{'$gte':new Date(gte),'$lte':new Date(lte)}};
		this.log.info("query option:"+JSON.stringify(option));
		AppModel.find(option,callback);
	}
	/*
	getAppCached : function(appid,gte,lte,callback){
		var key=appid+gte+lte;
		var dbModel=this.AppModel;
		redis.get(key, function (err, reply) {
	        if (err) {
	        	callback(err,'null');
	        }
	        else if (reply){
	        	callback(err,JSON.parse(reply));
	        }
	        else {
				var option={app:appid,updatedAt:{'$gte':new Date(gte),'$lte':new Date(lte)}};
				dbModel.find(option,function (err, doc) {

	                if (err || !doc) {
	                	callback(err,'null');
	                }
	                else {
	                    redis.set(key, JSON.stringify(doc), function () {
	                        console.log('set finish');
	                    });
	                    callback(err,doc);
	                }
	            });
	        }
		});
	}
	*/
}

module.exports=Database;
