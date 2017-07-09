voronoi.Game = function (
    log,
    api,
    ui,
    config,
) {
  var current_user_index = null;
  var profile = null;
  var db = null;

  function onChange(data) {
    log(data);
    // zovem api i on mi vrati promise u kojem ce biti novi get 
  }

  // Expects api to be initialized before this is called.
  this.initialize = function (first_get_response) {
    log("initializing..", first_get_response);
    db = first_get_response.db;
    current_user_index = first_get_response.current_user_index;
    profile = db.userList[current_user_index];
    log("healthy!", profile);
    ui.initialize(onChange);
    ui.updateDatabase(profile, db);
  };
};
