const { Service } = require('egg');
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
