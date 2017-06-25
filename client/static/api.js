// id_token obtained by user.getAuthResponse().id_token
voronoi.Api = function (
      log,
      $statusDiv,
      config,
      id_token,
    ) {
  var that = this;
  var profile = {
    name : null
  };

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
          profile.name = data.name;
          return that;
        }
      });
  };

  this.getName = function () {
    return profile.name;
  };
};
