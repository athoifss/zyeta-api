"use strict";
const bcrypt = require("bcrypt");
const {
  sendSuccess,
  createError,
  sendSuccessWithMeta,
} = require("../../helpers/response");

const { issueToken } = require("../../helpers/auth");
const queries = require("./auth.queries");

exports.postUserLogin = (req, res, next) => {
  const { password } = req.body;

  queries.findUserFromEmail(req.body).then((result) => {
    if (!result) {
      const error = createError("Email not found", 401);
      return next(error);
    }

    bcrypt.compare(password, result.password, (err, isPassMatch) => {
      if (err) next(err);

      let user = {
        _id: result._id,
        roleLevel: result.roleLevel,
        department: result.department,
        createdBy: result.createdBy,
      };

      const token = issueToken({ ...user });

      user = { ...user, email: result.email };

      if (isPassMatch) sendSuccess(res, { ...user, token }, "");
      else {
        const error = createError("Incorrect Credentials", 401);
        next(error);
      }
    });
  });
};
