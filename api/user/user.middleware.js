const { createError } = require("../../helpers/response");
const { ObjectId } = require("mongodb");

const RolesHierarchy = ["L4", "L3", "L2", "L1"];
exports.authoriseUserCreation = () => {
  return (req, res, next) => {
    function sendError(msg) {
      next(createError(msg, 403));
    }

    const creatorRoleLevel = req.auth.roleLevel;
    const createdRoleLevel = req.body.roleLevel;

    if (RolesHierarchy.indexOf(creatorRoleLevel) === -1)
      sendError("Given role does not exist");

    const allowedRoleLevels = RolesHierarchy.slice(
      RolesHierarchy.indexOf(creatorRoleLevel)
    );

    if (allowedRoleLevels.indexOf(createdRoleLevel) === -1)
      sendError("User not authorized to create given role level");

    next();
  };
};
