voronoi.Logger = function () {

  var t0 = (new Date()).getTime();

  this.getLog = function (prefix) {
    return function () {
      args = Array.prototype.slice.call(arguments);
      var ms = (new Date()).getTime() - t0;
      args.unshift("+" + ms + " ms [" + prefix + "] : ");
      console.log.apply(window, args);
    };
  };

  this.onFatal = function () {
    args = Array.prototype.slice.call(arguments);
    var ms = (new Date()).getTime() - t0;
    args.unshift("+" + ms + " ms [FATAL] : ");
    document.write(
      "<h1>This is why we don't have nice things.</h1>" +
      args[1] + "<br/><pre>" +
      $("<pre>").text(JSON.stringify(args, null, 3)).html()
      + "</pre> .. ouch.");
    console.log.apply(window, args);
  }
};
