const { getDb } = require("../../helpers/database");

exports.insertKpi = (body) => {
  return getDb().collection("kpis").insertOne(body);
};

exports.insertPublishedKpis = (body) => {
  return getDb().collection("kpis-published").insertOne(body);
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
