'use strict';

module.exports = {
  env:'dev',
  db: 'mongodb://localhost:27017/chezheng'
  logPath:process.env.NODE_LOG_PATH||'logs/main.log'
};
