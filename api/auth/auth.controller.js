"use strict";

const router = require("express").Router();

const { validateSchema } = require("../../middlewares/schema-validation");

const service = require("./auth.service");
const schema = require("./auth.schema");
const { addFlags } = require("../../middlewares/flags-addition");

router.use(addFlags());

router.post(
  "/login",
  validateSchema(schema.postUserLogin),
  service.postUserLogin
);

module.exports = router;
