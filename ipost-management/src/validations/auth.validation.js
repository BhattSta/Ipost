const Joi = require("joi");
const validateRequest = require("../utils/requestValidation");
const httpStatus = require("http-status");
const { createResponseData } = require("../utils/response");
const constant = require("../utils/response");

async function registerValidation(req, res, next) {
  const register = {
    firstName: Joi.string()
      .min(3)
      .max(40)
      .required()
      // .lowercase()
      .trim()
      .pattern(
        /^([a-z]+\s)*[a-z]+$/,
        `validation as digits and consecutive spaces not allowed in`
      )
      .custom((value, helper) => {
        return value.charAt(0).toUpperCase() + "" + value.slice(1);
      }),

    lastName: Joi.string()
      .min(3)
      .max(40)
      .required()
      // .lowercase()
      .trim()
      .pattern(
        /^([a-z]+\s)*[a-z]+$/,
        `validation as digits and consecutive spaces not allowed in`
      )
      .custom((value, helper) => {
        return value.charAt(0).toUpperCase() + "" + value.slice(1);
      }),

    role: Joi.string().valid("user", "admin").trim(),

    email: Joi.string()
      .trim()
      .email()
      .required()
      .lowercase()
      .pattern(
        /^[a-zA-Z0-9]+@(ipost\.com)$/,
        "validation as suffix it should be @ipost.com only in"
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
  validateRequest(req, res, next, Joi.object(register));
}

async function LoginValidation(req, res, next) {
  const Login = {
    email: Joi.string().trim().email().required().lowercase(),

    password: Joi.string().required(),
  };
  validateRequest(req, res, next, Joi.object(Login));
}

module.exports = {
  registerValidation,
  LoginValidation,
};
