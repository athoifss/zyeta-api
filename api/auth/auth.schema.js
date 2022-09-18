"use strict";

const Joi = require("joi");

exports.postUserLogin = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
};
