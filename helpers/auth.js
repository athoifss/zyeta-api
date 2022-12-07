const jwt = require("jsonwebtoken");

const config = require("../config/config");

exports.issueToken = function (user) {
  var token = jwt.sign({ ...user, iss: "Zyeta" }, config.secretToken, {
    expiresIn: config.tokenExpiryTime,
  });
  return token;
};

exports.Roles = {};
