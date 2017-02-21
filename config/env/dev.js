'use strict';

module.exports = {
  env:'dev',
  db: process.env.DB_CON,
  logPath:process.env.NODE_LOG_PATH||'logs/main.log',
  webhost:'http://localhost:8080/s/',
  apiServerHost:''
};


