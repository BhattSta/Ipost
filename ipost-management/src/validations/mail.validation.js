const Joi = require("joi");
const validateRequest = require("../utils/requestValidation");

async function sendingMailValidation(req, res, next) {
  const mails = {
    from: Joi.string(),

    to: Joi.string().required().lowercase(),

    subject: Joi.string().trim().required(),

    message: Joi.string().trim().required(),

    attachments: Joi.optional(),
  };
  validateRequest(req, res, next, Joi.object(mails));
}

module.exports = {
  sendingMailValidation,
};
