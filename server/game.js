var config = require("./config.js");
var voronoi = require("../proto/generated_js/voronoi_pb.js")

var db_wrapper = new (require("./db.js"))();
var log = new (require("./logger.js"))("game");

module.exports = function () {
  var db = null;
  var user_id_to_index = {}

  this.get = function (profile) {
    return maybeAddUser(profile).then(function () {
      return {
        "db" : clean(db.toObject()),
        "current_user_index" : user_id_to_index[profile.id],
      };
    });
  };

  this.initialize = function () {
    return db_wrapper.initialize().then(buildIndex);
  };

  // Removes emails from the database.
  function clean(db) {
    var db = JSON.parse(JSON.stringify(db));
    for (var i = 0; i < db.userList.length; ++i) {
      delete db.userList[i].email;
    }
    return db;
  }

  // Adds a new user to the database if user currently doesn't exists.
  function maybeAddUser(profile) {
    if (profile.id in user_id_to_index) {
      return Promise.resolve();
    } else {
      var user = new voronoi.User();
      user.setEmail(profile.email);
      user.setId(profile.id);
      user.setName(profile.name);
      var user_index = db.getUserList().length;
      user_id_to_index[user.getId()] = user_index;
      db.addUser(user);
      log("New user index: ", user_id_to_index);
      return db_wrapper.flush();
    }
  }

  function buildIndex() {
    db = db_wrapper.get();
    var userList = db.getUserList();
    for (var i = 0; i < userList.length; ++i) {
      user_id_to_index[userList[i].getId()] = i;
    }
    log("User index: ", user_id_to_index);
  }
};
