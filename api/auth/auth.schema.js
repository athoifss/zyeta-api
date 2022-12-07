"use strict";

const Joi = require("joi");

exports.postUserLogin = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
};
