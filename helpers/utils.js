exports.getPaginationPipeline = (skipCount, pageSize) => {
  return [
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],
        data: [{ $skip: skipCount }, { $limit: pageSize }],
      },
    },
    {
      $project: {
        data: 1,
        totalCount: { $arrayElemAt: ["$metadata.total", 0] },
      },
    },
  ];
};

exports.getPaginationParams = ({ pageNo, pageSize }) => {
  return {
    skipCount: (pageNo - 1) * pageSize,
    limit: pageSize,
  };
};

exports.genMetaData = (result, { pageSize, pageNo }) => {
  const totalCount = result[0].totalCount;
  const pageCount = Math.ceil(totalCount ? totalCount / pageSize : 1);

  return {
    totalCount,
    pageCount,
    pageSize,
    pageNo,
  };
};
