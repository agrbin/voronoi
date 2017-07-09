$(window).on("load", function () {
  var ui = new voronoi.UI();
  var logger = new voronoi.Logger(ui);
  var auth = new voronoi.Auth(
    logger.getLog("auth"),
    ui,
  );
  var api = new voronoi.Api(
    logger.getLog("api"),
    ui,
    voronoi.config,
  );
  var game = new voronoi.Game(
    logger.getLog("game"),
    api,
    ui,
    voronoi.config,
  );

  auth
    .getIdToken()
    .then(function (id_token) {
      return api.initialize(id_token);
    })
    .then(function (first_get_response) {
      return game.initialize(first_get_response);
    })
    .catch(logger.onFatal);
});
