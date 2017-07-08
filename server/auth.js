var config = require("./config.js");
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var promisify = require("util.promisify");

function name(profile) {
  var result = profile.given_name + profile.family_name;
  result = result
    .replace(/[aeiou]/ig, '')
    .toLowerCase();
  return "#" + result;
}

// note, this class uses a global state to get client_id and stuff.
module.exports = function () {
  var client = new auth.OAuth2(config.auth.client_id, '', '');

  // Returns a promise that resolves to profile.
  this.verifyIdToken = function (token) {
    return new Promise(function (resolve, reject) {
      client.verifyIdToken(token, config.auth.client_id,
        function (e, login) {
          if (e) {
            return reject(e);
          }
          payload = login.getPayload();
          return resolve({
            id : payload.sub,
            email : payload.email,
            name : name(payload),
          });
        });
    });
  };
};
