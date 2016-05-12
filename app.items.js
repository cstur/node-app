var storage = require('node-persist');

function Item(){
	this.appsListKey='appsList';
	
	storage.initSync({
	  dir: '/opt/data',
	  stringify: JSON.stringify,
	  parse: JSON.parse,
	  encoding: 'utf8',
	  logging: false, 
	  continuous: true,
	  interval: false,
	  ttl: false,
	});
	this.appsList = storage.getItem(this.appsListKey) || [];
}

Item.prototype={
	getAppItem:function(){
		return this.getItem(this.appsListKey);
	},
	getItem:function(key){
		if (key==this.appsListKey) {
			this.appsList = storage.getItem(key) || [];
			return this.appsList;
		}
		return [];
	},
	addItem:function(item,key){
		if (key==this.appsListKey) {
			this.appsList.push(item);
			storage.setItem(key, this.appsList,function(err){
				if(err)console.log(err);
				console.log('add done');
			});
		}
		return [];
	},
	deleteItem:function(_index,key){
		if (key==this.appsListKey) {
			var _newList = [];
			for (var i = this.appsList.length - 1; i >= 0; i--) {
				if (this.appsList[i].index != _index) {
					_newList.push(this.appsList[i]);
				}
			};
			this.appsList = _newList;
			storage.setItem(key, this.appsList);
		}
		return [];
	}
}

module.exports=Item;