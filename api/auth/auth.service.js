"use strict";

const {
  sendSuccess,
  createError,
  sendSuccessWithMeta,
} = require("../../helpers/response");

const queries = require("./auth.queries");

exports.postUserLogin = (req, res, next) => {
  sendSuccess(res, {}, "Done");
};
