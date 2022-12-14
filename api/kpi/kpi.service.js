"use strict";

const { ObjectId } = require("mongodb");
const uuid = require("short-uuid");

const {
  sendSuccess,
  createError,
  sendSuccessWithMeta,
} = require("../../helpers/response");
const { convertArrToObj, genUuid } = require("../../helpers/utils");

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
  const body = { ...req.body };

  let insertQuery = req.body.userIds.map((userId) => ({
    kpiId: ObjectId(req.body.kpiId),
    userId: ObjectId(userId),
  }));

  delete body.userIds;
  delete body.kpiId;
  insertQuery = insertQuery.map((insertDoc) => ({ ...insertDoc, ...body }));

  queries
    .insertPublishedKpisMultiple(insertQuery)
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

  function addIdToChoices(choices) {
    return [...choices].map((choice) => ({ id: genUuid(4), ...choice }));
  }

  if (hasSubQuestions) {
    req.body.subQuestions = req.body.subQuestions.map((question) => {
      if (question.type === "MCQ") {
        question.choices = addIdToChoices(question.choices);
      }

      return { id: uuid.generate().substring(0, 6), ...question };
    });
  } else {
    if (req.body.type === "MCQ") {
      req.body.choices = addIdToChoices(req.body.choices);
    }
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

exports.submitKpi = async (req, res, next) => {
  const { kpiId, responses } = req.body;

  function getPointsForNumericInput(range, answer) {
    const [start, end] = range;
    const answerPercent = ((answer - start) / (end - start)) * 100;
    const answerFlattenedToTen = (answerPercent * 10) / 100;
    return answerFlattenedToTen;
  }

  function getPoints(question, answer) {
    const { type } = question;
    switch (type) {
      case "MCQ":
        const { choices } = question;
        return choices.find((f) => f.id === answer).points;

      case "NUMERIC":
        const { inputRange } = question;
        return getPointsForNumericInput(inputRange, answer);

      case "YES/NO":
        return question.points[answer];
    }
  }

  try {
    const kpiQuestions = await queries.getKpiQuestions({ kpiId: ObjectId(kpiId) });
    const kpi = await queries.getKpiById({ _id: ObjectId(kpiId) });
    const usersByCreator = await queries.getRandomUsersByKpiCreator({
      createdBy: ObjectId(kpi.createdBy),
    });

    const kpiQuesById = convertArrToObj(kpiQuestions, "_id");

    function getRandomUids() {
      function generateRandom(min = 0, max = 100) {
        let difference = max - min;
        let rand = Math.random();
        rand = Math.floor(rand * difference);
        rand = rand + min;
        return rand;
      }

      const userIds = [...usersByCreator];

      let randomUserIds = [];
      for (let i = 0; i < 3; i++) {
        const randIndex = generateRandom(0, userIds.length);

        if (userIds[randIndex]) {
          randomUserIds.push(userIds[randIndex]);
          userIds.splice(randIndex, 1);
        }
      }

      return randomUserIds;
    }

    let totPoints = 0;
    function createNewResponses() {
      return new Promise((resolve, reject) => {
        const responsesLen = req.body.responses.length;
        req.body.responses.forEach((response, index) => {
          const { questionId, answer } = response;

          const kpiQuestion = kpiQuesById[questionId];
          const { hasSubQuestions } = kpiQuestion;

          if (!hasSubQuestions) {
            const pointsSecured = getPoints(kpiQuestion, answer);
            totPoints += pointsSecured;
            response.pointsSecured = pointsSecured;

            if (kpiQuestion.hasFileUpload) {
              if (response.fileUrl) {
                const randomUserIds = getRandomUids();
                response.goldMine = {
                  assignedTo: randomUserIds.map(({ _id }) => ({
                    userId: ObjectId(_id),
                    isApproved: false,
                  })),
                  fileUrl: response.fileUrl,
                };
                if (index === responsesLen - 1) resolve();
              } else {
                if (index === responsesLen - 1) resolve();
              }
            }
          } else {
            const { subQuestions } = kpiQuestion;
            const subQuesById = convertArrToObj(subQuestions, "id");

            response.subQuestions.forEach(async (respSubQues) => {
              const kpiSubQues = subQuesById[respSubQues.id];
              const ansSubQues = respSubQues.answer;

              const pointsSecured = getPoints(kpiSubQues, ansSubQues);
              totPoints += pointsSecured;
              respSubQues.pointsSecured = pointsSecured;

              if (kpiQuestion.hasFileUpload) {
                if (response.fileUrl) {
                  const randomUserIds = getRandomUids();
                  respSubQues.goldMine = {
                    assignedTo: randomUserIds.map(({ _id }) => ({
                      userId: ObjectId(_id),
                      isApproved: false,
                    })),
                    fileUrl: response.fileUrl,
                  };
                  if (index === responsesLen - 1) resolve();
                } else {
                  if (index === responsesLen - 1) resolve();
                }
              }
            });
          }
        });
      });
    }

    await createNewResponses();
    const insertQuery = { ...req.body, totPoints };

    queries
      .insertKpiSubmission(insertQuery)
      .then((result) => {
        sendSuccess(res, result, "", 201);
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};

exports.getSpecificKpi = (req, res, next) => {
  const { kpiId } = req.params;
  const findQuery = { ...req.body, _id: ObjectId(kpiId) };

  queries
    .getSpecificKpi(findQuery)
    .then((result) => {
      if (result.length) sendSuccess(res, result[0], "");
      else sendSuccess(res, {}, "");
    })
    .catch((err) => next(err));
};

/************************************************************************************************ */

function validateQuestionSchema(body) {
  const { hasSubQuestions, type } = body;

  /* Sanity Checks */

  if (type === "NUMERIC") {
    if (!body.hasOwnProperty("inputRange") && !hasSubQuestions) {
      const error = createError("Input range missing", 400);
      throw error;
    }
  }

  if (type === "MCQ" && !hasSubQuestions) {
    if (!body.hasOwnProperty("choices")) {
      const error = createError("Choices missing", 400);
      throw error;
    }
  }

  if (hasSubQuestions) {
    if (!body.hasOwnProperty("subQuestions")) {
      const error = createError("SubQuestions missing", 400);
      throw error;
    }

    if (body.hasOwnProperty("hasFileUpload")) {
      const error = createError("hasFileUpload need to be per sub question", 400);
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
