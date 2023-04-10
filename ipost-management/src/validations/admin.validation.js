const Joi = require("joi");
const validateRequest = require("../utils/requestValidation");

async function adminRegistrationValidation(req, res, next) {
  const adminRegister = {
    firstName: Joi.string()
      .min(3)
      .max(40)
      .required()
      // .lowercase()
      .trim()
      .pattern(
        /^([A-Za-z]+\s)*[A-Za-z]+$/,
        `validation as digits and consecutive spaces not allowed in`
      ),
    // .custom((value, helper) => {
    //   return value.charAt(0).toUpperCase() + "" + value.slice(1);
    // }),

    lastName: Joi.string()
      .min(3)
      .max(40)
      .required()
      // .lowercase()
      .trim()
      .pattern(
        /^([A-Za-z]+\s)*[A-Za-z]+$/,
        `validation as digits and consecutive spaces not allowed in`
      ),
    // .custom((value, helper) => {
    //   return value.charAt(0).toUpperCase() + "" + value.slice(1);
    // }),

    role: Joi.string().valid("admin").trim(),

    email: Joi.string()
      .trim()
      .email()
      .required()
      .lowercase()
      .pattern(
        /^[a-zA-Z0-9]+@(technostacks\.com)$/,
        "validation as suffix should be @technostacks.com only in"
      ),

    password: Joi.string()
      .required()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{4,}$/,
        "validation as password must contain atleast 1 uppercase, 1 lowecase, 1 digit & 1 special character in"
      ),

    confirmPassword: Joi.string().custom((value, helper) => {
      if (value !== req.body.password) {
        return helper.message("Password And Confirm Password Are Not Same");
      }
    }),
  };
  validateRequest(req, res, next, Joi.object(adminRegister));
}

async function adminLoginValidation(req, res, next) {
  const adminLogin = {
    email: Joi.string()
      .trim()
      .email()
      .required()
      .lowercase()
      .pattern(
        /^[a-zA-Z0-9]+@(technostacks\.com)$/,
        "validation as suffix should be @technostacks.com only in"
      ),

    password: Joi.string().required(),
  };
  validateRequest(req, res, next, Joi.object(adminLogin));
}

module.exports = {
  adminRegistrationValidation,
  adminLoginValidation,
};
