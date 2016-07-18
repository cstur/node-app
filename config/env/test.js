'use strict';

module.exports = {
  env:'test',
  db: 'mongodb://localhost:27017/chezheng',
  logPath:process.env.NODE_LOG_PATH||'/data/nodelogs/main.log',
  webhost:'http://athena.ichezheng.com/s/',
  apiServerHost:''
};
