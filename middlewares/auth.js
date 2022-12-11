"use strict";

const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { secretToken } = require("../config/config");
const { createError } = require("../helpers/response");

const { RoleLevels } = require("../helpers/auth");

exports.authorize = function (roleLevels = RoleLevels.All) {
  if (!Array.isArray(roleLevels)) roleLevels = [roleLevels];

  return (req, res, next) => {
    function sendError(msg) {
      next(createError(msg, 403));
    }

    try {
      const token = req.headers["Authorization"] || req.headers["authorization"];

      if (!token) return sendError("No Token"); // Token does not exist
      if (token.indexOf("Bearer") !== 0) return sendError("Token format invalid"); // Wrong format

      const tokenString = token.split(" ")[1];
      jwt.verify(tokenString, secretToken, (err, decodedToken) => {
        if (err) return sendError("Broken Or Expired Token");

        if (!decodedToken.roleLevel) return sendError("Role missing");

        const userRole = decodedToken.roleLevel;
        if (roleLevels.indexOf(userRole) === -1) return sendError("User not authorized");

        req.auth = { ...decodedToken, _id: ObjectId(decodedToken._id) };
        next();
      });
    } catch (err) {
      next(err);
    }
  };
};
