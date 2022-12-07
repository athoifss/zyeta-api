"use strict";

const { ObjectId } = require("mongodb");
const uuid = require("short-uuid");

const {
  sendSuccess,
  createError,
  sendSuccessWithMeta,
} = require("../../helpers/response");

const queries = require("./kpi.queries");

exports.createKpi = (req, res, next) => {
  const insertQuery = { ...req.body, status: 0 };
  queries
    .insertKpi(insertQuery)
    .then((result) => {
      sendSuccess(res, result, "Kpi Created", 201);
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateKpiStatus = (req, res, next) => {
  const { status, _id } = req.body;
  if (status !== 0 && status !== 1) {
    const error = createError("Wrong value for status, has to be 0 or 1", 400);
    return next(error);
  }

  delete req.body._id;
  queries
    .updateKpi({ _id: ObjectId(_id) }, req.body)
    .then((result) => {
      sendSuccess(res, result, "KPI status updated");
    })
    .catch((err) => {
      next(err);
    });
};

exports.publishKpi = (req, res, next) => {
  const insertQuery = {
    kpiId: ObjectId(req.body.kpiId),
    userIds: req.body.userIds.map((userId) => ObjectId(userId)),
    ...req.body,
  };

  queries
    .insertPublishedKpis(insertQuery)
    .then((result) => {
      sendSuccess(res, result, "Published KPIs created", 201);
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateKpi = (req, res, next) => {
  const { _id } = req.body;
  delete req.body._id;

  queries
    .updateKpi({ _id: ObjectId(_id) }, req.body)
    .then((result) => {
      sendSuccess(res, result, "KPI updated");
    })
    .catch((err) => {
      next(err);
    });
};

exports.addQuestion = (req, res, next) => {
  validateQuestionSchema(req.body); // sanity check

  const { hasSubQuestions } = req.body;
  if (hasSubQuestions) {
    req.body.subQuestions = req.body.subQuestions.map((question) => ({
      quesId: uuid.generate().substring(0, 6),
      ...question,
    }));
  }

  const insertQuery = {
    ...req.body,
    kpiId: ObjectId(req.body.kpiId),
  };

  queries
    .insertKpiQuestion(insertQuery)
    .then((result) => {
      sendSuccess(res, result, "", 201);
    })
    .catch((err) => {
      next(err);
    });
};

exports.editKpiQuestion = (req, res, next) => {
  validateQuestionSchema(req.body); // sanity check

  const { _id } = req.body;
  delete req.body._id;

  queries
    .updateKpiQuestion({ _id: ObjectId(_id) }, req.body)
    .then((result) => {
      sendSuccess(res, result, "Kpi Question updated");
    })
    .catch((err) => next(err));
};

/************************************************************************************************ */

function validateQuestionSchema(body) {
  const { hasSubQuestions } = body;

  /* Sanity Checks */
  if (hasSubQuestions) {
    if (!body.hasOwnProperty("subQuestions")) {
      const error = createError("SubQuestions missing", 400);
      throw error;
    }

    if (body.hasOwnProperty("answer")) {
      const error = createError("answer needs to be per question", 400, {});
      throw error;
    }

    if (body.hasOwnProperty("hasFileUpload")) {
      const error = createError(
        "hasFileUpload need to be per sub question",
        400
      );
      throw error;
    }

    if (body.hasOwnProperty("points")) {
      const error = createError("points has to given per sub question", 400);
      throw error;
    }
  } else {
    if (body.hasOwnProperty("subQuestions")) {
      const error = createError(
        "subQuestions added with hasSubQuestions as 'false'",
        400
      );
      throw error;
    }
  }
}
