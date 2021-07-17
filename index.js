const express = require("express");
const bodyParser = require("body-parser");

const policiesRoutes = require("./routes/policies.routes");
const HttpError = require("./models/HttpError");

const app = express();
const mongoConnect = require("./utils/database").mongoConnect;

//Parsing the incoming text
app.use(bodyParser.json());

//Setting the required headers
app.use((req, res, next) => {
  res.setHeader("Access-control-Allow-Origin", "*");
  res.setHeader("Access-control-Allow-Headers", "*");
  res.setHeader("Access-control-Allow-Methods", "*");
  next();
});

//Setting Routes
app.use("/api/policies/", policiesRoutes);

//Handling final error
app.use((req, res) => {
  const error = new HttpError("Could not find the required data", 404);
  res.status(error.code || 500).json({ message: error.message });
});

mongoConnect(() => {
  app.listen(5000);
});
