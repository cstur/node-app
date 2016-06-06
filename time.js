

var timestamp="1465219604000";
console.log("timestamp:"+timestamp);
var d=new Date();
d.setTime(timestamp);
console.log("Date String:"+d.toDateString());
console.log("GMT String:"+d.toGMTString());
console.log("ISO String:"+d.toISOString());
console.log("GMT to timestamp:"+Date.parse(new Date(d.toGMTString())));
