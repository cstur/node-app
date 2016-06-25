
/*
	Task ID 1
	field: first level field
*/
exports.pvunique = function taskPVUnique(p,q,uniqueField){
	var o = {}; 
	o.scope={p:p,field:uniqueField};

	o.map = function() { 
		var d = new Date(this.createdAt);

		var k=d.getFullYear();
		var m=d.getMonth()+1;
		if (p==1) {
			k=k+'-'+m;
		}else if (p==2) {
			k=k+'-'+m+'-'+d.getDate();
		}else if (p==3) {
			k=k+'-'+m+'-'+d.getDate()+'-'+d.getHours();
		}

		if (this.pv) {
			emit(k,this.pv);
		}
	}    

	o.reduce = function(key, values) {
		var uniqueList=[];
        for (var i = values.length - 1; i >= 0; i--) {
        	var find=0;
        	for (var j = uniqueList.length - 1; j >= 0; j--) {
        		if (uniqueList[j]==values[i][field]) {
        			find=1;
        			break;
        		}
        	}
        	if (find==0) {
        		uniqueList.push(values[i][field]);
        	}
        }
	    return {pv:values.length,unique:uniqueList.length};
	}

	o.query  = q;  

	return o;
}

/*
	Task ID 2
*/
exports.convertion = function taskConvertionRate(q){
	var o = {}; 

	o.map = function() { 
		if (this.pv&&this.pv.prePVID) {
			emit(this.pv.prePVID,1);
		}
	}    

	o.reduce = function(prePVID, count) {
	    return Array.sum(count);
	}

	o.query  = q;  

	return o;
}

/*
	Task ID 3
*/
/*
exports.pv = function taskPV(p,q){
	var o = {}; 
	o.scope={p:p};

	o.map = function() { 
		var d = new Date(this.createdAt);

		var k=d.getFullYear();
		var m=d.getMonth()+1;
		if (p==1) {
			k=k+'-'+m;
		}else if (p==2) {
			k=k+'-'+m+'-'+d.getDate();
		}else if (p==3) {
			k=k+'-'+m+'-'+d.getDate()+'-'+d.getHours();
		}

		if (this.pv) {
			emit(k,this.pv);
		}
	}    

	o.reduce = function(key, values) {
	    return {pv:values.length};
	}

	o.query  = q;  

	return o;
}
*/

/*
	Task ID 3
*/
exports.pv = function taskPV(p,q){
	var o = {}; 
	o.scope={p:p};

	o.map = function() { 
		var d = new Date(this.createdAt);

		var k=d.getFullYear();
		var m=d.getMonth()+1;
		if (p==1) {
			k=k+'-'+m;
		}else if (p==2) {
			k=k+'-'+m+'-'+d.getDate();
		}else if (p==3) {
			k=k+'-'+m+'-'+d.getDate()+'-'+d.getHours();
		}

		if (this.pv) {
			emit({day: k}, {count: 1});
		}
	}    

	o.reduce = function(key, values) {
	    var count = 0;

		values.forEach(function(v) {
		    count += v['count'];
		});

		return {count: count};
	}

	o.query  = q;  

	return o;
}


