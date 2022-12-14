"use strict";

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.createKpi = {
  body: Joi.object({
    name: Joi.string(),
  }),
};

exports.updateKpiStatus = {
  body: Joi.object({
    _id: Joi.objectId().required(),
    status: Joi.number().valid(0, 1).required(),
  }),
};

exports.createKpiQuestion = {
  body: Joi.object({
    kpiId: Joi.objectId().required(),
    order: Joi.number().required(),
    type: Joi.string().required(),
    hasFileUpload: Joi.boolean(),
    content: Joi.string().required(),
    choices: Joi.array()
      .min(2)
      .items(
        Joi.object({
          content: Joi.string().required(),
          points: Joi.number(),
        })
      ),
    inputRange: Joi.array().min(2).max(2).items(Joi.number()),
    hasSubQuestions: Joi.boolean(),
    subQuestions: Joi.array()
      .items(
        Joi.object({
          order: Joi.number().required(),
          type: Joi.string().required(),
          content: Joi.string().required(),
          choices: Joi.array()
            .min(2)
            .items(
              Joi.object({
                content: Joi.string().required(),
                points: Joi.number(),
              })
            ),
          inputRange: Joi.array().min(2).max(2).items(Joi.number()),
          hasFileUpload: Joi.boolean().required(),
        })
      )
      .min(1),
    weightage: Joi.number().required(),
  }),
};

exports.updateKpi = {
  body: Joi.object({
    _id: Joi.objectId().required(),
    name: Joi.string().required(),
  }),
};

exports.editKpiQuestion = {
  body: Joi.object({
    _id: Joi.objectId().required(),
    order: Joi.number().required(),
    points: Joi.number(),
    hasFileUpload: Joi.boolean(),
    title: Joi.string().required(),
    choices: Joi.array().min(2),
    answer: Joi.alternatives(Joi.string(), Joi.number()),
    hasSubQuestions: Joi.boolean(),
    subQuestions: Joi.array()
      .items(
        Joi.object({
          order: Joi.number().required(),
          type: Joi.string().required(),
          points: Joi.number().required(),
          title: Joi.string().required(),
          choices: Joi.array().min(2),
          answer: Joi.alternatives(Joi.string(), Joi.number()),
          hasFileUpload: Joi.boolean().required(),
        })
      )
      .min(1),
    weightage: Joi.number().required(),
  }),
};

exports.publishKpi = {
  body: Joi.object({
    kpiId: Joi.objectId().required(),
    userIds: Joi.array().items(Joi.objectId()).min(1).required(),
  }),
};
