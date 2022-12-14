"use strict";

const router = require("express").Router();

const { validateSchema } = require("../../middlewares/schema-validation");
const { authorize } = require("../../middlewares/auth");
const { addFlags } = require("../../middlewares/flags-addition");

const service = require("./kpi.service");
const schema = require("./kpi.schema");

const { RoleLevels } = require("../../helpers/auth");

/* For get requests add the flags here itself, but for post and put need access 
   to req.auth object when can only got afer the authorize middleware so called 
   again for those methods */ router.use(addFlags());

router.post(
  "/",
  authorize(RoleLevels.L3),
  validateSchema(schema.createKpi),
  addFlags(),
  service.createKpi
);

router.put(
  "/",
  authorize(RoleLevels.L3),
  validateSchema(schema.updateKpi),
  addFlags(),
  service.updateKpi
);

router.get("/:kpiId", authorize(), service.getSpecificKpi);

router.patch(
  "/status",
  authorize(RoleLevels.L3),
  validateSchema(schema.updateKpiStatus),
  addFlags(),
  service.updateKpiStatus
);

router.post(
  "/publish",
  authorize(RoleLevels.L3),
  validateSchema(schema.publishKpi),
  addFlags(),
  service.publishKpi
);

router.post(
  "/questions",
  authorize(RoleLevels.L3),
  validateSchema(schema.createKpiQuestion),
  addFlags(),
  service.addQuestion
);

router.put(
  "/questions",
  authorize(RoleLevels.L3),
  validateSchema(schema.editKpiQuestion),
  service.editKpiQuestion
);

router.post("/submit", authorize(RoleLevels.L1), addFlags(), service.submitKpi);

module.exports = router;
