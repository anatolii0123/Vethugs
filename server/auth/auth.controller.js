const User = require('../user/user.model')
const crypto = require('crypto');
const _ = require("lodash");
const nodemailer = require('nodemailer')

const FRONTEND_URL = 'www.fynance.capital/'

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  const { email, password } = req.body
  let user = await User.findOne({ email })
  if (!user) {
    return res.json({
      error: 'No User'
    })
  }
  if (!user.activated) {
    return res.json({
      error: 'You are not verified.'
    })
  }
  if (password === user.password) {
    return res.json(user.toAuthJSON());
  }
  return res.json({
    error: 'Wrong Password'
  })
}

async function verify(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  const { verifyCode } = req.body
  let user = await User.findOne({ verificationCode: verifyCode })
  if (!user) {
    return res.json({
      error: 'Verificatoin Failed'
    })
  }
  user.activated = true
  user.save()
    .then(usr => res.json(usr.toAuthJSON()))
    .catch(e => next(e));
}

async function forgotPassword(req, res, next) {
  const { email, password } = req.body
  console.log("forgetting password:", email, password)
  let user = await User.findOne({ email: email })
  if (!user) {
    return res.json({
      error: 'No User with that email'
    })
  }
  user.resetCode = crypto.randomBytes(30).toString('hex')
  user.newPassword = password

  user.save()
    .then(usr => {
      const mailOptions = {
        from: 'btcbetting.herokuapp.com/',
        to: email,
        subject: 'Trading Platform Forgot Password Success',
        text: `<div>Good work. Please follow this link and you can reset password.<br/>You can resume trading.</div><a href='${FRONTEND_URL}/resetPassword/${user.resetCode}'>Reset Password</a>`,
        text: `<div>Good work. Please follow this link and you can reset password.<br/>You can resume trading.</div><a href='${FRONTEND_URL}/resetPassword/${user.resetCode}'>Reset Password</a>`,
      };
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        name: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'geniusdev1108@gmail.com',
          pass: 'QWER!@#$qwer1234'
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      transporter.verify((err, success) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Server is ready to take our message");
          transporter.sendMail(mailOptions, res => console.log(res))
          return res.json(usr.toAuthJSON())
        }
      });
    })
  return res.json({ error: 'error' })
}

async function resetPassword(req, res, next) {
  const { resetCode } = req.body
  let user = await User.findOne({ verificationCode: resetCode })
  if (!user) {
    return res.json({
      error: 'Reset Password Failed'
    })
  }
  user.password = user.newpassword
  user.save()
    .then(usr => res.json(usr.toAuthJSON()))
    .catch(e => next(e));
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login, getRandomNumber, verify, forgotPassword, resetPassword };
