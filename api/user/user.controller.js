"use strict";

const router = require("express").Router();

const { authorize } = require("../../middlewares/auth");
const { addFlags } = require("../../middlewares/flags-addition");
const { validateSchema } = require("../../middlewares/schema-validation");

const service = require("./user.service");
const schema = require("./user.schema");
const { authoriseUserCreation } = require("./user.middleware");

const { RoleLevels } = require("../../helpers/auth");

/* For get requests add the flags here itself, but for post and put need access 
   to req.auth object when can only got afer the authorize middleware so called 
   again for those methods */ router.use(addFlags());

router.post(
  "/",
  authorize(RoleLevels.L3),
  addFlags(),
  authoriseUserCreation(),
  service.createNewUser
);

router.put(
  "/",
  authorize(RoleLevels.L3),
  validateSchema(schema.editUser),
  addFlags(),
  service.editUser
);

router.get("/profile", authorize(), service.getUserProfile);

router.get("/", authorize("L4"), service.getUsers);

module.exports = router;
