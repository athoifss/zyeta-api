"use strict";

const router = require("express").Router();

const { validateSchema } = require("../../middlewares/schema-validation");

const service = require("./auth.service");
const schema = require("./auth.schema");

router.post(
  "/login",
  validateSchema(schema.postUserLogin),
  service.postUserLogin
);

module.exports = router;
