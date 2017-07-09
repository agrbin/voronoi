// This should be the only javascript who is aware of .html layout and css.
voronoi.UI = function (
) {
  this.appendLog = function (args) {
    $("#init").append($("<pre>").text(args.join(" ")));
  };

  this.getAuthElements = function () {
    return {
      auth: $("#auth"),
      sign_in: $("#sign-in-or-out-button"),
      revoke: $("#revoke-access-button"),
      auth_status: $("#auth-status"),
    };
  };

  var $statusDiv = $("#api-status");
  this.apiStatus = function (text) {
    $statusDiv.text(text);
  };

  this.updateDatabase = function (profile, db) {
    $(".name").text(profile.name);
  };

  // callback is called when submit button on make-a-change form is clicked
  // with dictinoary containing filled data:
  // - name, lat, lng
  this.initialize = function (onChangeCallback) {
    $("#init").hide();
    $("#game-ui").show();

    $("#game-ui .update").hide();
    $("#game-ui .view").show();

    $(".view .make-a-change").click(function (e) {
      e.preventDefault();
      $("#game-ui .update").show();
      $("#game-ui .view").hide();
    });

    $(".update .cancel").click(function (E) {
      $("#game-ui .update").hide();
      $("#game-ui .view").show();
    });

    $(".update form").submit(function (e) {
      e.preventDefault();
      onChangeCallback({
        name: $("#update-name").val(),
        lat: $("#update-lat").val(),
        lng: $("#update-lng").val(),
      });
      $("#game-ui .update").hide();
      $("#game-ui .view").show();
    });
  }
};
