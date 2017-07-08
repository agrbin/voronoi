// id_token obtained by user.getAuthResponse().id_token
voronoi.Api = function (
      log,
      $statusDiv,
      config,
      id_token,
    ) {
  var that = this;
  var current_user_index = null;
  var profile = null;
  var db = null;

  function getEndpoint(endpoint) {
    return config.backend.api + endpoint;
  }

  function query(endpoint, data) {
    data = Object.assign(data || {}, {
      id_token: id_token
    });
    $statusDiv.text("api: " + endpoint + " loading..");
    return Promise.resolve($.ajax({
      cache: false,
      data: data,
      dataType: "json",
      method: "POST",
      url: getEndpoint(endpoint),
    })).then(function (result) {
      $statusDiv.text("");
      return result;
    });
  }

  // Returns a promise with 'this' Api object if server recognizes our
  // id_token. Also profile will be filled out.
  this.initialize = function () {
    return query("get")
      .then(function (data) {
        if ("error" in data) {
          return Promise.reject(new Error(data.error));
        } else {
          db = data.db;
          current_user_index = data.current_user_index;
          profile = data.db.userList[current_user_index];
          return that;
        }
      });
  };

  this.getName = function () {
    return profile.name;
  };
};
