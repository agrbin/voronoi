// id_token obtained by user.getAuthResponse().id_token
voronoi.Api = function (
      statusDiv,
      config,
      id_token,
    ) {
  var that = this;

  function getEndpoint(endpoint) {
    return config.backend.api + endpoint;
  }

  // Returns a Promise.
  this.getState = function () {
    return Promise.resolve($.ajax({
      cache: false,
      data: {
        id_token: id_token,
      },
      dataType: "text",
      method: "POST",
      url: getEndpoint("get"),
    }));
  };
};
