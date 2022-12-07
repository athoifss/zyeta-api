const { ObjectId } = require("mongodb");
const { getDb } = require("./database");

exports.createSuperAdmin = () => {
  const user = {
    name: "Super Admin",
    email: "superadmin@gmail.com",
    password: "password",
    departmentId: ObjectId("6387d018973dcb5cdc8840a6"),
    employeeId: "EZ670",
    roleLevel: "L4",
    createdAt: new Date(),
    isActive: true,
    isDeleted: false,
  };

  const bcrypt = require("bcrypt");

  bcrypt.hash(user.password, 10, (err, hashedPassword) => {
    if (err) throw err;

    let insertQuery = {
      ...user,
      password: hashedPassword,
    };

    const query = getDb().collection("users").insertOne(insertQuery);
    query
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        throw err;
      });
  });
};
