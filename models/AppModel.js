var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

var AppSchema   = new Schema({
	app: String,
    data: mongoose.Schema.Types.Mixed
});

AppSchema.plugin(timestamps);

module.exports = mongoose.model('AppModel', AppSchema);