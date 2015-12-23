var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

  // look for the requested files, first in ./public
  fs.access(path, fs.F_OK, function (err) {
    console.log(err ? 'this process can\'t see a file there' : 'can find');
  });
    // then in ./archives

  // find that read file names thing
    // if req.url = / or index.html or index.htm, serve index
};



// As you progress, keep thinking about what helper functions you can put here!
