const express = require("express");
const app = express();

const logger = require("morgan");
const cors = require("cors");
// const swaggerUI = require("swagger-ui-express");

const errorHandling = require("./middlewares/error-handling");
const config = require("./config/config");
const { initDb } = require("./helpers/database");

// const { swaggerDoc } = require("./docs/_api_documentation");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

/* Comment new branch commit, staging*/

/*Routing by domain*/
app.use("/auth", require("./api/auth/auth.controller"));
app.use("/users", require("./api/user/user.controller"));
app.use("/kpis", require("./api/kpi/kpi.controller"));

/*Error handling middlewares*/
app.use(errorHandling.logError);
app.use(errorHandling.sendError);

app.listen(config.port, (err) => {
  if (err) throw err;

  initDb((err) => {
    if (err) throw err;

    console.log(`Server up on ${config.port}`);
  });
});
