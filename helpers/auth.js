const jwt = require("jsonwebtoken");
const config = require("../config/config");

const RolesArray = ["L4", "L3", "L2", "L1"];
const len = RolesArray.length;

exports.issueToken = function (user) {
  return jwt.sign({ ...user, iss: "Zyeta" }, config.secretToken, {
    expiresIn: config.tokenExpiryTime,
  });
};

exports.RoleLevels = {
  All: RolesArray,
  L4: RolesArray.slice(0, 1),
  L3: RolesArray.slice(0, 2),
  L2: RolesArray.slice(0, 3),
  L1: RolesArray.slice(0, 4),
};
