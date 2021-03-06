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
		logger.info('open mongodb');
	});
	this.log=logger;
}

Database.prototype={

	saveApp : function(data){
  		var appEntity = new AppModel(data);
  		appEntity.save(); 
	},

	getApp : function(appid,gte,lte,callback){
		var option={app:appid,updatedAt:{'$gte':new Date(gte),'$lte':new Date(lte)}};
		this.log.info("query option:"+JSON.stringify(option));
		AppModel.find(option,callback);
	},
	getAppTimeStamp : function(appid,gte,lte,callback){
		var start=new Date();
		start.setTime(gte);
		var end=new Date();
		end.setTime(lte);
		var option={app:appid,updatedAt:{'$gte':start,'$lte':end}};
		this.log.info("getAppTimeStamp:"+JSON.stringify(option));
		AppModel.find(option,callback);
	},
	queryByTimeStamp : function(gte,lte,per,page,callback){
		var start=new Date();
		start.setTime(gte);
		var end=new Date();
		end.setTime(lte);
		var option={updatedAt:{'$gte':start,'$lte':end}};
		this.log.info("query by timestamp:"+JSON.stringify(option));
		this.log.info("query limit "+per);
		this.log.info("query page "+page);
		AppModel.find(option)
				//.count(function(err, count){
    				//console.log("Number of docs: ", count );
				//})
				.limit(Math.abs(per))    
				.skip(Math.abs(per) * Math.abs(page))
			    .sort({
			        updatedAt: 'desc'
			    })
			    .exec(callback);
	},
	qCount : function(gte,lte,res){
		var start=new Date();
		start.setTime(gte);
		var end=new Date();
		end.setTime(lte);
		var option={updatedAt:{'$gte':start,'$lte':end}};
		this.log.info("query by timestamp:"+JSON.stringify(option));
		AppModel.find(option)
				.count(function(err, count){
    				console.log("Number of docs: ", count );
    				res.send({docNumber:count});
				});
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
