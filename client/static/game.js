voronoi.Game = function (
    log,
    api,
    ui,
    config,
) {
  var current_user_index = null;
  var profile = null;
  var db = null;

  function updateState(response) {
    db = response.db;
    current_user_index = response.current_user_index;
    profile = db.userList[current_user_index];
    ui.updateDatabase(profile, db);
  }

  function onChange(data) {
    api.change(data)
      .then(function (response) {
        log("change completed.");
        updateState(response);
      })
      .catch(function (response) {
        if (response.error) {
          log("app error in change: ", response);
          alert(response.error);
        }
      });
  }

  // Expects api to be initialized before this is called.
  this.initialize = function (first_get_response) {
    log("initializing..", first_get_response);
    updateState(first_get_response);
    log("healthy!", profile);
    ui.initialize(onChange);
  };
};
