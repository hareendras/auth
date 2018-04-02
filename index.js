const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
// DB setup
mongoose
  .connect("mongodb://localhost/auth")
  .then(console.log("Connected"))
  .catch(err => console.log("cudnt connect", err));

// app setup

app.use(morgan("combined")); // app.use registers middleware => morgan here is a loggin framework
app.use(bodyParser.json({ type: "*/*" })); // bodyparser parses any incoming request as JSON
router(app);

//server setup

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("server listening on ", port);
