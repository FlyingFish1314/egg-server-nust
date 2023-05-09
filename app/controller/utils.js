const svgCaptcha = require('svg-captcha');

const BaseController = require('./base');

class UtilsController extends BaseController {
  async captcha () {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSIze: 50,
      width: 100,
      height: 50,
      noise: 3,
    });
    this.ctx.session.captcha = captcha.text;
    this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = captcha.data;
  }

  async sendcode () {
    const { ctx } = this;
    const email = ctx.query.email;
    const code = Math.random().toString().slice(2, 6);
    console.log(code);
    ctx.session.emailCode = code;

    const subject = '博客验证码';
    const test = '';
    const html = `<h2>个人博客</h2><span>${code}</span>`;
    const hasSend = await this.service.tools.sendMail(email, subject, test, html);
    if (hasSend) {
      this.message('发送成功');
    } else {
      this.error('发送失败');
    }
  }
}

module.exports = UtilsController;
