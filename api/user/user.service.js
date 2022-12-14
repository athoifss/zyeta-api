"use strict";

const {
  sendSuccess,
  createError,
  sendSuccessWithMeta,
} = require("../../helpers/response");

const queries = require("./user.queries");

const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { genMetaData } = require("../../helpers/utils");

exports.createNewUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) return next(err);

    let insertQuery = {
      ...req.body,
      password: hashedPassword,
    };

    queries
      .addNewUser(insertQuery)
      .then((result) => {
        sendSuccess(res, result, "", 201);
      })
      .catch((err) => next(err));
  });
};

exports.getUserProfile = (req, res, next) => {
  queries
    .getUserProfile({ ...req.body, _id: req.auth._id })
    .then((result) => {
      sendSuccess(res, result, "");
    })
    .catch((err) => {
      next(err);
    });
};

exports.editUser = (req, res, next) => {
  queries.getUserProfile({ _id: ObjectId(req.body._id) }).then((result) => {
    const user = result;

    if (!user) {
      const error = createError("User not found", 400, {
        detail: "There is no user with given _id",
      });
      return next(error);
    }

    if (user.createdBy.toString() !== req.auth._id.toString()) {
      const error = createError("Unauthorized", 403, {
        detail: "You are not allowed to edit this user",
      });
      return next(error);
    }

    queries
      .updateUser({ _id: ObjectId(req.body._id) }, req.body)
      .then((result) => {
        sendSuccess(res, result, "");
      })
      .catch((err) => {
        next(err);
      });
  });
};

exports.getUsers = (req, res, next) => {
  const findQuery = { ...req.body, createdBy: ObjectId(req.auth._id) };
  queries
    .getUsers(findQuery, req.query)
    .then((result) => {
      const metaData = genMetaData(result, req.query);
      sendSuccessWithMeta(res, result[0].data, metaData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserKpis = (req, res, next) => {
  const findQuery = { ...req.body, userId: ObjectId(req.auth._id) };
  queries
    .getUserKpis(findQuery, req.query)
    .then((result) => {
      const metaData = genMetaData(result, req.query);
      sendSuccessWithMeta(res, result[0].data, metaData);
    })
    .catch((err) => {
      next(err);
    });
};
