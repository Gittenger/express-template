const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //create transporter (define the service that sends the email)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //define email options
  const mailOptions = {
    from: 'user name <test@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  //send the emailer using nodemailer
  //returns promise
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
