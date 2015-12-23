var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelp = require("./http-helpers.js");
var fs = require('fs');

exports.handleRequest = function (req, res) {
  console.log(req.method + ' <-- req.method', req.url + ' <-- req.url');

  var url = req.url;
  var pathObjUrl = path.parse(url);
  var pageRequested = pathObjUrl.base;
  var localPath = path.join('./public/', pageRequested);
  console.log(localPath);
  // console.log(pathObjUrl.base);
  fs.access('./public/index.html', fs.F_OK, function (err) {
    console.log(err ? 'this process can\'t see a file there' : 'can find');
  });

  // var fileStream = fs.createReadStream(filename);
  // fileStream.on('error', function (error) {
  //     response.writeHead(404, { "Content-Type": "text/plain"});
  //     response.end("file not found");
  // });
  // fileStream.on('open', function() {
  //     var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
  //     response.writeHead(200, {'Content-Type': mimeType});
  // });
  // fileStream.on('end', function() {
  //     console.log('sent file ' + filename);
  // }
  // fileStream.pipe(response);


  if (req.method === 'GET') {
    res.end('./public/index.html');
  }


  res.end(archive.paths.list);
};
