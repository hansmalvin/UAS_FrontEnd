const Joi = require("joi");

const signupValidators = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  //   password: Joi.string()
  //   .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

const loginValidators = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  signupValidators,
  loginValidators,
};
