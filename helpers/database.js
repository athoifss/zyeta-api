const Pool = require("pg").Pool;
const config = require("../config/config");

const pool = new Pool({
  user: config.dbUser,
  host: config.dbHost,
  database: config.db,
  password: config.dbPassword,
  port: "5432",
});

module.exports = {
  query: (...args) => {
    return new Promise((resolve, reject) => {
      return pool
        .connect()
        .then((client) => {
          return client
            .query(...args)
            .then((res) => {
              client.release();
              resolve(res.rows);
            })
            .catch((err) => {
              client.release();
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  pool: pool,
};
