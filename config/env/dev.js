'use strict';

module.exports = {
  env:'dev',
  db: 'mongodb://101.201.102.76:27017/chezheng',
  logPath:process.env.NODE_LOG_PATH||'logs/main.log',
  webhost:'http://localhost:8080/s/',
  apiServerHost:''
};
