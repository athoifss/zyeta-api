const { ObjectId } = require("mongodb");
const { getDb } = require("../../helpers/database");

exports.insertKpi = (body) => {
  return getDb().collection("kpis").insertOne(body);
};

exports.insertPublishedKpis = (body) => {
  return getDb().collection("kpis-published").insertOne(body);
};

exports.insertPublishedKpisMultiple = (body) => {
  return getDb().collection("kpis-published").insertMany(body);
};

exports.updateKpi = (findQuery, body) => {
  return getDb()
    .collection("kpis")
    .updateOne(findQuery, { $set: { ...body } });
};

exports.insertKpiQuestion = (body) => {
  return getDb().collection("kpi-questions").insertOne(body);
};

exports.updateKpiQuestion = (findQuery, body) => {
  return getDb()
    .collection("kpi-questions")
    .updateOne(findQuery, { $set: { ...body } });
};

exports.getKpiQuestions = (findQuery) => {
  return getDb().collection("kpi-questions").find(findQuery).toArray();
};

exports.getKpiById = (findQuery) => {
  return getDb().collection("kpis").findOne(findQuery);
};

exports.getRandomUsersByKpiCreator = ({ createdBy }) => {
  const aggregation = [{ $match: { createdBy } }, { $sample: { size: 3 } }];
  return getDb().collection("users").aggregate(aggregation).toArray();
};

exports.insertKpiSubmission = (insertQuery) => {
  return getDb().collection("kpi-submissions").insertOne(insertQuery);
};

exports.getSpecificKpi = (findQuery) => {
  const aggregation = [
    { $match: { _id: ObjectId(findQuery._id) } },
    {
      $lookup: {
        from: "kpi-questions",
        let: { kpiId: "$_id" },
        as: "questions",
        pipeline: [{ $match: { $expr: { $eq: ["$kpiId", "$$kpiId"] } } }],
      },
    },
  ];
  return getDb().collection("kpis").aggregate(aggregation).toArray();
};
