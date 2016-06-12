
exports.pvuv= function taskPVUV(p,q){
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

	    //emit(k,{pv:1,uv:1,uid:this.pv.uid});
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
	    return {pv:values.length,uv:uniqueList.length,uid:''};
	    
        //return {pv:values.length};
	}

	o.query  = q;  

	return o;
}


