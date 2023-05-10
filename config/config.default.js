/* eslint valid-jsdoc: "off" */

// 'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path');
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1682560528613_8639';

  config.multipart = {
    mode: 'file',
    whitelist: () => true,
  };
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public');
  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/kkbhub',
        options: {
          // 解决版本淘汰问题
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      },
    },
    jwt: {
      secret: '123456',
    },
  };
};

