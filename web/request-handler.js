var path = require('path');
var AH = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelp = require('./http-helpers');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  console.log('============================================', req.method + ' <-- req.method', req.url + ' <-- req.url');

  var url = req.url;
  var pathObjUrl = path.parse(url);
  var pageRequested;
  if (req.method === 'GET' && url === '/' || req.method === 'GET' && url === '/index.htm') {
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
  var publicUrl = path.join(AH.paths.siteAssets, pageRequested);
  var archivesUrl = path.join(AH.paths.archivedSites, pageRequested);
  var archivesUrlPlusHtml = archivesUrl + '.html';
  // console.log(publicUrl);
  console.log(archivesUrl);
  console.log(archivesUrlPlusHtml);
  // console.log(AH.readListOfUrls(AH.paths.list, function(err, data) {
  //         console.log(data, 'filling in cb in 35 of req handler');
  //       }), 'logging readListOfUrls in 36 of rh');

  AH.isUrlInList(AH.paths.list, 'why6.com', function(err, booData){
    if (err) throw err;
    console.log(booData, ' <-- this is the boolean hauled out of the isUrlInList callback chain');
  });

  AH.isUrlArchived(AH.paths.archivedSites, 'google.com.html', function(err, booData){
    if (err) throw err;
    console.log(booData, ' <-- this is the boolean checking if google is archived');
  });

  if (req.method === 'POST') {
    var holderString = '';
      req.on('data', function(data) {
          holderString += data;
      });
      req.on('end', function() {
        var urlGivenInBox = holderString.slice(4);
        console.log(urlGivenInBox, '<-- this is url typed into form, sliced at 4');
        var urlToAppend = urlGivenInBox + '\n';
        // check if web address saved in sites.txt
        if (AH.isUrlInList(AH.paths.list, urlGivenInBox, function(err, booData){
          if (err) throw err;
          console.log(booData, ' <-- isUrlInList result');
          return booData;
        })) {
          // if no, save web address
          AH.addUrlToList(AH.paths.list, urlToAppend);
        }
        // check if website in archives/sites/
        if (AH.isUrlArchived(AH.paths.archivedSites, 'google.com.html', function(err, booData){
          if (err) throw err;
          console.log(booData, ' <-- isUrlArchived result');
          return booData;
        })) {
          // if yes, call 302, redirect to that site

        }
        else {
          // if no, call 302 to loading.html (303 more technically correct)

        }
        var urlToFeedToPostStream = path.join('./archives/sites/', urlGivenInBox);
        var postStream = fs.createReadStream(urlToFeedToPostStream);

        postStream.on('error', function (error) {
          console.log(error, '<-- this error came from postStream.on error, over to loading');

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


  // console.log(mimeTypeIn);
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

    //http://stackoverflow.com/questions/7268033/basic-static-file-server-in-nodejs
  var fileStream = fs.createReadStream(publicUrl);

  fileStream.on('error', function (error) {
    console.log(error, '<-- this error came from fileStream.on error');

    var fileStreamArchived = fs.createReadStream(archivesUrlPlusHtml);
    fileStreamArchived.on('error', function (error) {
      console.log(error, '<-- this error came from fileStreamArchived.on error');

      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('file not found');
    });

    fileStreamArchived.on('open', function() {
      // console.log('In fileStream.on open');
      res.writeHead(200, {'Content-Type': mimeTypeOut});
    });

    fileStreamArchived.on('end', function() {
      console.log('sent file ' + archivesUrlPlusHtml);
    });

    fileStreamArchived.pipe(res);
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
