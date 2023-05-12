const { Service } = require('egg');
const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const userEmail = 'fanenlongwork@126.com';
const transporter = nodemailer.createTransport({
  host: 'smtp.126.com',
  port: 465,
  secure: true,
  auth: {
    user: userEmail,
    pass: 'IOTYYTDGXOBIGCQX',
  },
});

class ToolService extends Service {
  async mergeFile (filePath, fileHash, size) {
    const chunkDir = path.resolve(this.config.UPLOAD_DIR, fileHash);
    let chunks = await fse.readdir(chunkDir);
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    // console.log('🚀 ~ file: tools.js:23 ~ ToolService ~ mergeFile ~ chunks:', chunks);
    chunks = chunks.map(cp => path.resolve(chunkDir, cp));
    // console.log('🚀 ~ file: tools.js:25 ~ ToolService ~ mergeFile ~ chunks:', chunks);
    await this.mergeChunks(chunks, filePath, size);
  }
  async mergeChunks (files, dest, size) {
    console.log('🚀 ~ file: tools.js:28 ~ ToolService ~ mergeChunks ~ dest:', dest);
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath);
      readStream.on('end', () => {
        // fse.unlinkSync(filePath);
        resolve();
      });
      readStream.pipe(writeStream);
    });

    await Promise.all(
      files.map(async (file, index) => {
        const start = index * size;
        let end = (index + 1) * size;
        if (index === files.length - 1) {
          const sizeEnd = await fse.stat(file);
          end = (index + 1) * sizeEnd.size;
        }
        return pipStream(file, fse.createWriteStream(dest, { start, end }));
      })
    );
    // console.log('🚀 ~ file: tools.js:48 ~ ToolService ~ mergeChunks ~ res:', res);
  }

  async sendMail (email, subject, test, html) {
    const mailOptions = {
      from: userEmail,
      cc: userEmail,
      to: email,
      subject,
      test,
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log('email error', err);
      return false;
    }

  }

}


module.exports = ToolService;
