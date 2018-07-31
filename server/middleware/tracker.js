'use strict';

module.exports = function(params) {
  if (params && params.active) {
    return function tracker(req, res, next) {
      const url = req.url;
      console.log('Requesting %s %s', req.method, url);
      var start = process.hrtime();
      res.once('finish', function() {
        var diff = process.hrtime(start);
        var ms = diff[0] * 1e3 + diff[1] * 1e-6;
        console.log('Request time for %s %s is %d ms.', req.method, url, ms);
      });
      return next();
    };
  }
  return function tracker(req, res, next) {
    return next();
  };
};
