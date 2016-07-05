'use strict';

module.exports = {
  env:'pro',
  db: 'mongodb://localhost:27017/chezheng',
  logPath:process.env.NODE_LOG_PATH||'/data/nodelogs/main.log',
  webhost:'http://zeus.ichezheng.com/s/'
};
