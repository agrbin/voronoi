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

  // Returns a promise:
  // - if not rejected this is a healthy data message
  // - if rejected this is a data message with app error
  // If network error occurs, it will fatal-out and reject a promise with an
  // empty dict.
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
    }))
    .then(function (result) {
      ui.apiStatus("");
      return result;
    })
    // this is failure on network stack.
    .catch(function (err) {
      log.onFatal(err);
      return Promise.reject({});
    })
    .then(function (result) {
      ui.apiStatus("");
      if ("error" in result) {
        return Promise.reject(result);
      }
      return result;
    });
  }

  // data should be name, lat, lng.
  // See query for promise behavior on network error.
  this.change = function (data) {
    return query("change", data);
  };

  // Returns a promise with first_get_respone if server recognizes our
  // id_token.
  // See query for promise behavior on network error.
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
