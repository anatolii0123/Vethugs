/**
 * Email Service
 */
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = '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'
const EMAIL_SENDER = 'admin@em2232.deskhunters.com'

sgMail.setApiKey(SENDGRID_API_KEY);
const sendEmail = async msg => {
  msg.from = EMAIL_SENDER;
  const response = await sgMail.send(msg);
  console.log("response", response);
  if (response[0].statusCode == 200 || response[0].statusCode == 202)
    return 'Success';
  return 'Failure';
}

// var nodemailer = require('nodemailer');
// var sgTransport = require('nodemailer-sendgrid-transport');

// var options = {
//   auth: {
//     api_user: 'olivepcj@gmail.com',
//     api_key: 'deskhunter_password_1234567890'
//   }
// }

// const sendEmail = async msg => {
//   var client = nodemailer.createTransport(sgTransport(options));
//   msg.from = process.env.EMAIL_SENDER;
//   const response = await client.sendMail(msg);
//   console.log("response", response);
//   return response;
// }

module.exports = {
  sendEmail
}