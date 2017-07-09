voronoi.Api = function (
    log,
    ui,
    config,
) {
  // id_token obtained by user.getAuthResponse().id_token
  var that = this;
  var id_token = null;

  function getEndpoint(endpoint) {
    return config.backend.api + endpoint;
  }

  function query(endpoint, data) {
    data = Object.assign(data || {}, {
      id_token: id_token
    });
    ui.apiStatus("api: " + endpoint + " loading..");
    return Promise.resolve($.ajax({
      cache: false,
      data: data,
      dataType: "json",
      method: "POST",
      url: getEndpoint(endpoint),
    })).then(function (result) {
      ui.apiStatus("");
      return result;
    }).catch(function (err) {
      ui.apiStatus("");
      return Promise.reject(err);
    });;
  }

  // Returns a promise with first_get_respone if server recognizes our
  // id_token.
  this.initialize = function (id_token_) {
    id_token = id_token_;
    log("initializing..");
    return query("get")
      .then(function (data) {
        if ("error" in data) {
          return Promise.reject(new Error(data.error));
        } else {
          log("healthy!");
          return data;
        }
      });
  };
};
