
/*
	Task ID 1
*/
exports.pvuv = function taskPVUV(p,q){
	var o = {}; 
	o.scope={p:p};

	o.map = function() { 
		var d = new Date(this.createdAt);

		var k=d.getFullYear();
		if (p==1) {
			k=k+'-'+d.getMonth();
		}else if (p==2) {
			k=k+'-'+d.getMonth()+'-'+d.getDate();
		}else if (p==3) {
			k=k+'-'+d.getMonth()+'-'+d.getDate()+'-'+d.getHours();
		}

	    emit(k,this.pv);
	}    

	o.reduce = function(key, values) {
		var uniqueList=[];
        for (var i = values.length - 1; i >= 0; i--) {
        	var find=0;
        	for (var j = uniqueList.length - 1; j >= 0; j--) {
        		if (uniqueList[j]==values[i].uid) {
        			find=1;
        			break;
        		}
        	}
        	if (find==0) {
        		uniqueList.push(values[i].uid);
        	}
        }
	    return {pv:values.length,uv:uniqueList.length};
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
	    emit(this.pv.prePVID,1);
	}    

	o.reduce = function(prePVID, count) {
	    return Array.sum(count);
	}

	o.query  = q;  

	return o;
}


