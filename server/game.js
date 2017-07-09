var config = require("./config.js");
var voronoi = require("../proto/generated_js/voronoi_pb.js")

var db_wrapper = new (require("./db.js"))();
var log = new (require("./logger.js"))("game");

module.exports = function () {
  var db = null;
  var user_id_to_index = {}

  // NOTE: once this method calls into voronoi generation, we need to lock it.
  // Why? user A changes his location and starts voronoi computation wiht graph
  // G0.
  // user B changes his location and starts computation with G0.
  // computation for user A finishes.
  // computation for user B finishes and changes of A are lost.
  this.change = function (profile, data) {
    var user = getUser(profile);
    if (user === false) {
      return Promise.reject("user not yet registered.");
    }
    if ("name" in data) {
      if (data.name.match(/^[a-z]+$/) === null) {
        return Promise.reject("name should be all lowercase letters");
      }
      if (data.name.length > 8) {
        return Promise.reject("name too long.");
      }
      user.setName(data.name);
      return db_wrapper.flush()
        .then(function () {
          return buildResponse(profile);
        });
    }
  };

  this.get = function (profile) {
    return maybeAddUser(profile)
      .then(function () {
        return buildResponse(profile);
      });
  };

  this.initialize = function () {
    return db_wrapper.initialize().then(buildIndex);
  };

  function buildResponse(profile) {
    return {
      "db" : clean(db.toObject()),
      "current_user_index" : user_id_to_index[profile.id],
    };
  }

  // Removes emails from the database.
  function clean(db) {
    var db = JSON.parse(JSON.stringify(db));
    for (var i = 0; i < db.userList.length; ++i) {
      delete db.userList[i].email;
    }
    return db;
  }

  function getUser(profile) {
    if (profile.id in user_id_to_index) {
      return db.getUserList()[user_id_to_index[profile.id]];
    } else {
      return false;
    }
  }

  // Adds a new user to the database if user currently doesn't exists.
  function maybeAddUser(profile) {
    if (getUser(profile) !== false) {
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
