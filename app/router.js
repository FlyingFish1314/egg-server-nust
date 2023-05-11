'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({ app });
  router.get('/', controller.home.index);
  // 验证码
  router.get('/captcha', controller.utils.captcha);
  router.get('/sendcode', controller.utils.sendcode);
  router.post('/uploadFile', controller.utils.uploadFile);
  router.post('/mergeFile', controller.utils.mergeFile);
  router.post('/checkFile', controller.utils.checkFile);


  router.group({ name: 'users', prefix: '/user' }, router => {
    const { info, register, login, verify } = controller.user;

    router.post('/register', register);
    router.get('/info', jwt, info);
    router.post('/login', login);
    router.get('/verify', verify);
  });
};
