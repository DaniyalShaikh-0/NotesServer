var express = require("express");
var http = require("http");

var app = express();

app.use("/sd", function (request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  console.log("\n", request.body);
  if (!request.body) {
    next();
  }
});
app.use("/sd", function (request, response, next) {
  console.error("HERRDK");
  next();
});
app.use("/", function (request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello, world!");
});

http.createServer(app).listen(3000);
