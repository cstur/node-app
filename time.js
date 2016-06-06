var moment   = require('moment');

console.log(moment().subtract(10, 'days').calendar());
console.log(moment().format());
console.log(moment().subtract(1,'days').endOf('day').format());