"use strict";

const { ObjectId } = require("mongodb");

exports.addFlags = (method) => {
  return (req, res, next) => {
    if (req.method === "GET" || method === "GET") {
      req.body = { ...req.body, isActive: true, isDeleted: false };
      req.query = {
        pageNo: req.query.pageNo || 1,
        pageSize: req.query.pageSize || 20,
      };
    }

    if ((req.method === "POST" || method === "POST") && req.auth) {
      req.body = {
        ...req.body,
        isActive: true,
        isDeleted: false,
        createdBy: ObjectId(req.auth._id),
        createdAt: new Date(),
      };
    }

    if ((req.method === "PUT" || method === "PUT") && req.auth) {
      req.body = {
        ...req.body,
        editedBy: ObjectId(req.auth._id),
        editedAt: new Date(),
      };
    }

    next();
  };
};
