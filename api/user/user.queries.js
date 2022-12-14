const { getDb } = require("../../helpers/database");
const { getPaginationParams, getPaginationPipeline } = require("../../helpers/utils");

exports.addNewUser = (body) => {
  return getDb().collection("users").insertOne(body);
};

exports.getUserProfile = (body) => {
  return getDb()
    .collection("users")
    .findOne(body, { projection: { password: 0 } });
};

exports.editUserProfile = (body) => {
  return getDb().collection("users").update();
};

exports.updateUser = (findQuery, body) => {
  delete body._id;
  return getDb()
    .collection("users")
    .updateOne(findQuery, { $set: { ...body } });
};

exports.getUsers = (body, query) => {
  const { skipCount, limit } = getPaginationParams(query);
  const aggregation = [{ $match: body }, ...getPaginationPipeline(skipCount, limit)];
  return getDb().collection("users").aggregate(aggregation).toArray();
};

exports.getUserKpis = (body, query) => {
  const { skipCount, limit } = getPaginationParams(query);

  const aggregation = [
    { $match: body },
    {
      $lookup: {
        from: "kpis",
        let: { kpiId: "$kpiId" },
        as: "kpi",
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$kpiId"] } } }],
      },
    },
    {
      $unwind: { path: "$kpi", preserveNullAndEmptyArrays: false },
    },
    ...getPaginationPipeline(skipCount, limit),
  ];
  return getDb().collection("kpis-published").aggregate(aggregation).toArray();
};
