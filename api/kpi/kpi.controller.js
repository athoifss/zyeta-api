"use strict";

const router = require("express").Router();

const { validateSchema } = require("../../middlewares/schema-validation");

const service = require("./kpi.service");
const schema = require("./kpi.schema");

const { authorize } = require("../../middlewares/auth");
const { addFlags } = require("../../middlewares/flags-addition");

/* For get requests add the flags here itself, but for post and put need access 
   to req.auth object when can only got afer the authorize middleware so called 
   again for those methods */
router.use(addFlags());

router.post(
  "/",
  authorize(["L4", "L3"]),
  validateSchema(schema.createKpi),
  addFlags(),
  service.createKpi
);

router.put(
  "/",
  authorize(["L4", "L3"]),
  validateSchema(schema.updateKpi),
  addFlags(),
  service.updateKpi
);

router.patch(
  "/status",
  authorize(["L4", "L3"]),
  validateSchema(schema.updateKpiStatus),
  addFlags(),
  service.updateKpiStatus
);

router.post(
  "/publish",
  authorize(["L4", "L3"]),
  validateSchema(schema.publishKpi),
  addFlags(),
  service.publishKpi
);

router.post(
  "/questions",
  authorize(["L4"]),
  validateSchema(schema.createKpiQuestion),
  addFlags(),
  service.addQuestion
);

router.put(
  "/questions",
  authorize(["L4"]),
  validateSchema(schema.editKpiQuestion),
  service.editKpiQuestion
);

module.exports = router;
