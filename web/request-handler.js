var path = require('path');
var AH = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelp = require('./http-helpers');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  console.log(req.method + ' <-- req.method', req.url + ' <-- req.url');

  var url = req.url;
  var pathObjUrl = path.parse(url);
  var pageRequested;
  if (req.method === 'GET' && url === '/' || url === 'index.htm') {
    pageRequested = 'index.html';
  }
  else {
    //console.log(pathObjUrl, '<-- this is pathObjUrl, look at base');
    pageRequested = pathObjUrl.base;
  }
  var mimeTypeIn = path.parse(pageRequested).ext.slice(1);
  console.log(pageRequested, '<-- this is pageRequested');
  var mimeTypeOut;
  // var pathObjUrl = path.parse(url);
  // console.log(pathObjUrl, '<-- this is pathObjUrl, look at base');
  // var pageRequested = pathObjUrl.base;
  // console.log(pageRequested, '<-- this is pageRequested');
  // console.log(pageRequested, '<-- this is pageRequested after index fix?');

  // var mimeType = pathObjUrl.ext;
  var publicUrl = path.join('./public/', pageRequested);
  var archivesUrl = path.join('./archives/', pageRequested);
  console.log(publicUrl);
  console.log(archivesUrl);

  if (req.method === 'POST') {
    var holderString = '';
      req.on('data', function(data) {
          holderString += data;
      });
      req.on('end', function() {
        var urlGivenInBox = holderString.slice(4);
        console.log(urlGivenInBox, '<-- this is data in holderString, sliced at 4');
        AH.addUrlToList(AH.paths.list, urlGivenInBox);
        var urlToFeedToPostStream = path.join('./archives/sites/', urlGivenInBox);
    // check if web address saved in sites.txt
      // if no, save web address

    // check if website in archives/sites/
      // if no, call 302 to loading.html (303 more technically correct)
      // if yes, call 302, redirect to that site
        var postStream = fs.createReadStream(urlToFeedToPostStream);

        postStream.on('error', function (error) {
          console.log(error, '<-- this error came from postStream.on error');

          res.writeHead(303, {'Content-Type': 'text/html', 'Location': 'public/loading.html'});
          res.end('file not found');
        });

        postStream.on('open', function() {
          console.log('In postStream.on open');

          res.writeHead(301, {'Content-Type': 'text/html'});
        });

        postStream.on('end', function() {
          console.log('sent file Post');
        });

        postStream.pipe(res);

    });
  }


  console.log(mimeTypeIn);
  var mimeTypes = {
      'html': 'text/html',
      'css': 'text/css',
      'ico': 'image/x-icon'
    };

  if (mimeTypeIn in mimeTypes) {
    mimeTypeOut = mimeTypes[mimeTypeIn];
    console.log('in mimeTypeIn true block', mimeTypeIn, mimeTypeOut);
  }
  else {
    mimeTypeOut = 'text/plain';
    console.log('in mimeTypeIn false block', mimeTypeIn, mimeTypeOut);
  }
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
  var fileStream = fs.createReadStream(publicUrl);

  fileStream.on('error', function (error) {
    console.log(error, '<-- this error came from fileStream.on error (404)');

    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('file not found');
  });

  fileStream.on('open', function() {
    // console.log('In fileStream.on open');

    res.writeHead(200, {'Content-Type': mimeTypeOut});
  });

  // fileStream.on('data', function() {
  //   console.log('In fileStream.on data');

  //   res.writeHead(200, {'Content-Type': 'text/html'});
  // });

  fileStream.on('end', function() {
    console.log('sent file ' + publicUrl);
  });

  fileStream.pipe(res);

//streams open (sometimes), then data, then end
//pipe sends stuff along as it happens

};
