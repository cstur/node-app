var moment  = require('moment');

var timestamp="1465219604000";
var lte="1465221767000";
console.log("timestamp:"+timestamp);
var d=new Date();
d.setTime(timestamp);
console.log("Date String:"+d.toDateString());
console.log("GMT String:"+d.toGMTString());
console.log("ISO String:"+d.toISOString());
console.log("GMT to timestamp:"+Date.parse(new Date(d.toGMTString())));
console.log("ISO to locale:"+new Date("2016-06-06T15:10:09.315Z").toLocaleString());
console.log("moment timestamp:"+moment().valueOf());
console.log("date timestamp:"+Date.parse(new Date()));

var timestamp1=moment().subtract(1,'days').startOf('day').valueOf();
var d1=new Date();
d1.setTime(timestamp1);
console.log("moment to locale:"+d1.toLocaleString());

var timestampWeek=moment().locale('zh-cn').subtract(1,'weeks').startOf('week').valueOf();
console.log("timestampWeek:"+timestampWeek);

var d2=new Date();
d2.setTime(timestampWeek);
console.log("timestampWeek to locale:"+d2.toLocaleString());
