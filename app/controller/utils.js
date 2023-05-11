const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');
const BaseController = require('./base');
const path = require('path');

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

  async uploadFile () {
    // /public/hash/(hash+index)
    const { ctx } = this;
    const file = ctx.request.files[0];
    const { name, hash } = ctx.request.body;
    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash);
    // 文件最终存储位置
    // const filePath = path.resolve()
    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath);
    }
    // await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename);
    await fse.move(file.filepath, `${chunkPath}/${name}`);
    this.message('切片上传成功');
  }

}

module.exports = UtilsController;
