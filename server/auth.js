var config = require("./config.js");
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var promisify = require("util.promisify");

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
          return resolve(login.getPayload());
        });
    });
  };
};
