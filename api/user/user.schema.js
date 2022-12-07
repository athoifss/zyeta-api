"use strict";

const Joi = require("joi");

exports.createNewUser = {
  body: Joi.object({
    email: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    departmentId: Joi.string().required(),
    employeeId: Joi.string().required(),
    roleLevel: Joi.string().required(),
  }),
};

exports.editUser = {
  body: Joi.object({
    _id: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().required(),
    departmentId: Joi.string().required(),
    employeeId: Joi.string().required(),
  }),
};
