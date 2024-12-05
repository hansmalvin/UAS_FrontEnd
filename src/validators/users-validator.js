const Joi = require("joi");

const signupValidators = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{6,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*).",
      "string.min": "Password must be at least 6 characters long.",
      "any.required": "Password is required.",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const loginValidators = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const forgotPasswordValidators = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{6,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*).",
      "string.min": "New password must be at least 6 characters long.",
      "any.required": "New password is required.",
    }),
});

module.exports = {
  signupValidators,
  loginValidators,
  forgotPasswordValidators,
};
