require("dotenv").config();
const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");

const app = express();
const routes = require("./routes/index");

// enable cors
app.use(cors());
app.options("*", cors());

app.use(express.static("src/public/attachments"));

// parse json request body
app.use(express.json());

// v1 api routes
app.use("/v1", routes);

module.exports = app;
