var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client_id = require("./config.js").client_id;
var client = new auth.OAuth2(client_id, '', '');

var connect = require('connect');
var bodyParser = require('body-parser');
var http = require('http');

var app = connect();

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

function name(profile) {
  var result = profile.given_name + profile.family_name;
  result = result
    .replace(/[aeiou]/ig, '')
    .toLowerCase();
  return "#" + result;
}

// stao sam kad pokusavam prenjeti client id od forntenda na backend na crypto
// siguran nacin.
// https://developers.google.com/identity/sign-in/web/backend-auth
// https://www.npmjs.com/package/connect
// kad uspijem poslat ajax i primit ga na serveru i rec "dobar si",
// server bi polako vec trebao poceti graditi rest i kod kako ce biti na kraju.
// 
// TODO TODO preciznije, napravi post endpoint ovdje i verificiraj id_token.
app.use("/api/get", function(req, res){
  client.verifyIdToken(
    req.body.id_token,
    client_id,
    function(e, login) {
      if (e) {
        res.error(e);
      } else {
        var payload = login.getPayload();
        var userid = payload['sub'];
        res.json({name : name(payload)});
      }
    }
  );
});

http.createServer(app).listen(53087);
