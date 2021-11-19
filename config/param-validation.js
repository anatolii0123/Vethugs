const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().regex(/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/).required(),
      birthday: Joi.string().required(),
      password: Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().regex(/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/).required(),
      password: Joi.string().required()
    }
  }
};
