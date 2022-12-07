const { getDb } = require("../../helpers/database");

exports.findUserFromEmail = (body) => {
  const findQuery = {
    email: body.email,
    isActive: true,
    isDeleted: false,
  };

  return getDb().collection("users").findOne(findQuery);
};
