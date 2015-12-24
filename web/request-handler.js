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
  var mimeType = pathObjUrl.ext;
  var publicUrl = path.join('./public/', pageRequested);
  var archivesUrl = path.join('./archives/', pageRequested);
  console.log(publicUrl);
  console.log(archivesUrl);

  // console.log(req.headers, ' <-- req.headers');

  console.log(mimeType);
  // fs.access('./public/index.html', fs.R_OK, function (err) {
  //   if (err) {
  //     console.log(err, '<-- this error came from fs.access');
  //     throw err;
  //   }
  //   console.log('can find');
  // });
    // // https://gist.github.com/dominictarr/2401787
    // request('http://sweet.as') //read from the internet
    //   .pipe(fs.createWriteStream(pathToFile)) //write to disk as data arrives.
    //   .on('end', function () {
    //      //done
    //   })

    //http://stackoverflow.com/questions/7268033/basic-static-file-server-in-nodejs
  var fileStream = fs.createReadStream('./public/index.html');

  fileStream.on('error', function (error) {
    console.log(error, '<-- this error came from fileStream.on error (404)');

    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('file not found');
  });

  fileStream.on('open', function() {
    // console.log('In fileStream.on open');

    res.writeHead(200, {'Content-Type': 'text/html'});
  });

  // fileStream.on('data', function() {
  //   console.log('In fileStream.on data');

  //   res.writeHead(200, {'Content-Type': 'text/html'});
  // });

  fileStream.on('end', function() {
    console.log('sent file ');
    // res.write(fileToDeliver, 'binary', function(err) {
    //   if (err) {
    //     // console.log(err, '<-- this error is from the 200 case of res.write');
    //     throw err;
    //   }
    // });
  });

  fileStream.pipe(res);

//streams open (sometimes), then data, then end
//pipe sends stuff along as it happens

  //   fs.readFile('./public/index.html', 'binary', function(err, fileToDeliver) {
  //     if(err) {
  //       res.writeHead(500, {'Content-Type': 'text/plain'});
  //       console.log(err, '<-- this error came from fs.readFile');
  //       res.write(err + "\n");
  //       res.end();
  //       return;
  //     }
  //     console.log(fileToDeliver, '<-- the fileToDeliver from fs.readFile');

  //     res.writeHead(200);
  //     res.write(fileToDeliver, 'binary', function(err) {
  //       if (err) {
  //         // console.log(err, '<-- this error is from the 200 case of res.write');
  //         throw err;
  //       }
  //       res.end();
  //     });
  //   });
  // });



  // if (req.method === 'GET') {
  //   var fileStream = fs.createReadStream('./public/index.html');
  //   console.log('in opened filestream?');

  //   fileStream.on('error', function (error) {
  //       res.writeHead(404, { "Content-Type": "text/plain"});
  //       res.end("file not found");
  //   });
  //   fileStream.on('open', function() {
  //       res.writeHead(200, {'Content-Type': 'text/html'});
  //   });
  //   fileStream.on('end', function() {
  //       console.log('sent file ' + filename);
  //   });
  //   fileStream.pipe(res);
  //   // res.end('./public/index.html');
  // }

  // res.end(archive.paths.list);

  // res.end();
};
