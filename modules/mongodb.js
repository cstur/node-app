var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var mongodbOptions = { };
var timestamps   = require('mongoose-timestamp');
var config = require('../config/index.js');
var async = require('async');

mongoose.connect(config.db, mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + config.db);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + config.db);
    }
});

if (config.env!='pro') {
    mongoose.set('debug', true);  
}

var Schema = mongoose.Schema;

/*
    role: 
        all   1
        query 2
*/
var User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    menu_list: [{type:String}],
    role:{ type: Number, default: 2 }
});
User.plugin(timestamps);

var PV = new Schema({ 
    pv: Schema.Types.Mixed 
});
PV.plugin(timestamps);

var PVTest = new Schema({ 
    pv: Schema.Types.Mixed 
});
PVTest.plugin(timestamps);


// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
  });
});

//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

//Define Models
var userModel = mongoose.model('User', User);
var pvModel   = mongoose.model('PV', PV);
var pvTestModel   = mongoose.model('PVTest', PVTest);

//Define Query
var pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page
    };
    async.parallel({
        count: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录
            Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        var count = results.count;
        $page.pageCount = (count - 1) / pageSize + 1;
        $page.totalSize = count;
        $page.results = results.records;
        callback(err, $page);
    });
};

// Export Models
exports.userModel = userModel;
exports.pvModel   = pvModel;
exports.pvTestModel = pvTestModel;
exports.pageQuery   = pageQuery;


