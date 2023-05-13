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
  async mergeFile () {
    const { ext, size, hash } = this.ctx.request.body;
    console.log('🚀 ~ file: utils.js:39 ~ UtilsController ~ mergeFile ~ ext, size, hash:', ext, size, hash);
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);
    await this.ctx.service.tools.mergeFile(filePath, hash, size);
    this.success({
      url: `/public/${hash}.${ext}`,
    });
  }
  async checkFile () {
    const { ctx } = this;
    const { ext, hash } = ctx.request.body;
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);

    let uploaded = false;
    let uploadList = [];
    if (fse.existsSync(filePath)) {
      // 文件存在
      uploaded = true;
    } else {
      uploadList = await this.getUploadedList(path.resolve(this.config.UPLOAD_DIR, hash));
    }
    console.log('🚀 ~ file: utils.js:63 ~ UtilsController ~ checkFile ~ uploadList:', uploadList);
    console.log('🚀 ~ file: utils.js:63 ~ UtilsController ~ checkFile ~ uploaded:', uploaded);
    this.success({
      uploaded,
      uploadList,
    });
  }
  async getUploadedList (dirPath) {
    return fse.existsSync(dirPath) ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.') : [];
  }

  async uploadFile () {
    // /public/hash/(hash+index)

    // 报错
    // if (Math.random() > 0.3) {
    //   console.log(this.ctx.request.body.name);
    //   this.ctx.status = 500;
    //   return;
    // }
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
