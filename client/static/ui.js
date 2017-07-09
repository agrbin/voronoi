// This should be the only javascript who is aware of .html layout and css.
voronoi.UI = function (
) {
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
};
