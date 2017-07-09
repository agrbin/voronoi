// server.js takes care of
// * serving
// * authentication
// * reporting back results or errors
var config = require("./config.js");

var connect = require('connect');
var bodyParser = require('body-parser');
var http = require('http');

var app = connect();
var auth = new (require("./auth.js"));
var game = new (require("./game.js"));

var log = new (require("./logger.js"))("server");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.json = function (data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data, null, 3));
  }
  res.error = function (err) {
    console.log(err);
    res.json({error: "" + err});
  };
  next();
});

function process_api(handler, req, res) {
  auth.verifyIdToken(req.body.id_token)
    .then(function (profile) {
      return handler(profile, req.body);
    })
    .then(function (result) {
      res.json(result);
    })
    .catch(function (err) {
      res.error(err);
    });
}

// stao sam kad pokusavam prenjeti client id od forntenda na backend na crypto
// siguran nacin.
// https://developers.google.com/identity/sign-in/web/backend-auth
// https://www.npmjs.com/package/connect
// kad uspijem poslat ajax i primit ga na serveru i rec "dobar si",
// server bi polako vec trebao poceti graditi rest i kod kako ce biti na kraju.
// 
app.use(
    "/api/get",
    process_api.bind(null, game.get));

app.use(
    "/api/change",
    process_api.bind(null, game.change));

game.initialize().then(function () {
  log("initialized. listening on ", config.server.port);
  http
    .createServer(app)
    .listen(config.server.port);
});
