"use strict";

const router = require("express").Router();

const { validateSchema } = require("../../middlewares/schema-validation");

const service = require("./user.service");
const schema = require("./user.schema");
const { authoriseUserCreation } = require("./user.middleware");

const { authorize } = require("../../middlewares/auth");
const { addFlags } = require("../../middlewares/flags-addition");

router.use(addFlags());

router.get("/", authorize("L4"), service.getUsers);

router.post(
  "/",
  authorize(["L4", "L3"]),
  addFlags(),
  authoriseUserCreation(),
  service.createNewUser
);

router.put(
  "/",
  authorize(["L4", "L3"]),
  validateSchema(schema.editUser),
  addFlags(),
  service.editUser
);

router.get("/profile", authorize(), service.getUserProfile);

module.exports = router;
