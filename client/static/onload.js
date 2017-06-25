$(window).on("load", function () {
  function onError(err) {
    document.write(
      "<h1>This is why we don't have nice things.</h1>" +
      err + "<br/><pre>" +
      $("<pre>").text(JSON.stringify(err, null, 3)).html()
      + "</pre>");
    console.log(err);
  }

  var t0 = (new Date()).getTime();
  function log() {
    args = Array.prototype.slice.call(arguments);
    var ms = (new Date()).getTime() - t0;
    args.unshift("+" + ms + " ms: ");
    console.log.apply(window, args);
  }

  (new voronoi.Auth(
    log,
    $("#auth"),
    $("#sign-in-or-out-button"),
    $("#revoke-access-button"),
    $("#auth-status"),
  ))
  .getIdToken()
  .then(function (id_token) {
    return (new voronoi.Api(
        log,
        $("#api-status"),
        voronoi.config,
        id_token
      )).initialize();
  })
  .then(function (api) {
    console.log(api, "i have a warm api");
    $(".name").text(api.getName());
    $(".init").hide();
  }, onError);

});
