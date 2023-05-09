const md5 = require('md5');
const jwt = require('jsonwebtoken');
const BaseController = require('./base');


const HashSalt = ':asdasdasdasd ';
const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  password: { type: 'string' },
  captcha: { type: 'string' },
};

class UserController extends BaseController {

  async login () {
    const { ctx, app } = this;
    const { email, password, captcha, code } = ctx.request.body;
    // 验证码校验
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误');
    }
    if (code !== ctx.session.emailCode) {
      return this.error('邮箱验证码错误');
    }
    // 查找用户
    const user = await ctx.model.User.findOne({
      email,
      password: md5(password + HashSalt),
    });
    if (!user) {
      return this.error('用户名密码错误');
    }
    console.log(user);
    // 用户信息加密token
    const token = jwt.sign({
      _id: user._id, email,
    }, app.config.jwt.secret, {
      expiresIn: '1h',
    });
    this.success({
      token, email,
    });
  }

  async register () {
    const { ctx } = this;
    try {
      // 校验传递的参数
      ctx.validate(createRule);
    } catch (e) {
      console.log(e);
      return this.error('参数校验失败', -1, e.errors);
    }
    // 获取数据
    const { email, password, captcha, nickname } = ctx.request.body;
    console.log(email, password, captcha, nickname);

    // 校验验证码
    console.log(captcha.toUpperCase(), ctx.session.captcha.toUpperCase());
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      this.error('验证码错误');
    } else {
      // 校验邮箱是否重复
      if (await this.checkEmail(email)) {
        console.log(11);
        this.error('邮箱重复拉');
      } else {
        const ret = await ctx.model.User.create({
          email,
          password: md5(password + HashSalt),
          nickname,
        });
        if (ret._id) {
          this.message('注册成功');
        }
      }
      // this.success({ name: 'ok' });
    }
  }
  async checkEmail (email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
  async verify () {
    // 校验用户是否存在
  }

  async info () {
    this.success('ok');
  }
}

module.exports = UserController;
