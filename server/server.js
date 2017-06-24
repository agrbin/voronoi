var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client_id = "156401229517-rvtl9j6qej6nu6sti7r5s1ii6iav52vk.apps.googleusercontent.com";
var client = new auth.OAuth2(client_id, '', '');

var connect = require('connect');
var bodyParser = require('body-parser');
var http = require('http');

var app = connect();

app.use(bodyParser.urlencoded({
  extended: true
}));

// TODO
// stao sam kad pokusavam prenjeti client id od forntenda na backend na crypto
// siguran nacin.
// https://developers.google.com/identity/sign-in/web/backend-auth
// https://www.npmjs.com/package/connect
// kad uspijem poslat ajax i primit ga na serveru i rec "dobar si",
// server bi polako vec trebao poceti graditi rest i kod kako ce biti na kraju.
// 
// TODO TODO preciznije, napravi post endpoint ovdje i verificiraj id_token.
app.use(function(req, res){
  client.verifyIdToken(
    req.body.id_token,
    client_id,
    function(e, login) {
      var payload = login.getPayload();
      var userid = payload['sub'];
      console.log(userid);
      console.log(payload);
      res.end('Hello from Connect! OK!\n');
    }
  );
});


http.createServer(app).listen(53087);
