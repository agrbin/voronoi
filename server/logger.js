var t0 = (new Date()).getTime();

module.exports = function (prefix) {
  return function() {
    args = Array.prototype.slice.call(arguments);
    var ms = (new Date().getTime()) - t0;
    args.unshift((new Date()) + " (+" + ms + " ms) [" + prefix + "]:");
    console.log.apply(console, args);
    t0 = (new Date()).getTime();
  };
};
