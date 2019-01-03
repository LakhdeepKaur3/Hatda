var http = require("http");
var bodyParser = require("body-parser");
const express = require("express");
const app = express();
const passport = require("passport");
const strategies = require("./passport");
const routes = require("../api/routes");
let io = require("socket.io")(http);
var socket = require("./socket");

app.get("/", function(req, res) {
  res.sendfile("index.html");
});

//allow CORS
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Content-Length,  X-Requested-With, Content-Type, Accept, Authorization, request-node-status"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, HEAD, PUT, PATCH, DELETE"
  );
  next();
});

// parse body params and attach them to req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hatda Api running");
});

socket(io);

app.use(passport.initialize());
passport.use("jwt", strategies.jwt);
passport.use("facebook", strategies.facebook);
passport.use("google", strategies.google);

module.exports = app;
