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
  // console.log(pathObjUrl, '<-- this is pathObjUrl, look at base');

  // var mimeType = pathObjUrl.ext;
  var publicUrl = path.join(AH.paths.siteAssets, pageRequested);
  // console.log(publicUrl);

  // console.log(AH.readListOfUrls(AH.paths.list, function(err, data) {
  //         console.log(data, 'filling in cb in 35 of req handler');
  //       }), 'logging readListOfUrls in 36 of rh');

  // AH.isUrlInList(AH.paths.list, 'why6.com', function(err, booData){
  //   if (err) throw err;
  //   console.log(booData, ' <-- this is the boolean hauled out of the isUrlInList callback chain');
  // });

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
        if (!AH.isUrlInList(AH.paths.list, urlGivenInBox, function(err, booData){
          if (err) throw err;
          console.log(booData, ' <-- isUrlInList result');
          return booData;
        })) {
          // if no, save web address
          AH.addUrlToList(AH.paths.list, urlToAppend);
        }
        // check if website in archives/sites/
          // if no, call 302 to loading.html (303 more technically correct)
          // if yes, call 302, redirect to that site

        var archivedUrl = path.join(AH.paths.archivedSites, urlGivenInBox);
        var archivedUrlPlusHtml = archivedUrl + '.html';

        var postStream = fs.createReadStream(archivedUrlPlusHtml);
        console.log(archivedUrlPlusHtml);

        postStream.on('error', function (error) {
          // error = it didn't find the web/archives/sites/z-amber.com.html file... file not archived
          console.log(error, '<-- postStream.on error, file is not stored locally, over to loading');

          res.writeHead(303,
            { 'Content-Type': 'text/html',
              'Location'    : path.join(AH.paths.archivedSites, 'loading.html')
            });
          res.end('file not found');
        });

        postStream.on('open', function() {
          // open = it found the web/archives/sites/z-amber.com.html file... file archived
          console.log('In postStream.on open', archivedUrlPlusHtml);

          res.writeHead(301,
            { 'Content-Type': 'text/html',
              'Location'    : archivedUrlPlusHtml
            });
          res.end('the archived file is delivered');
        });

        postStream.on('end', function() {
          console.log('sent file Post', archivedUrlPlusHtml);
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
  var giveToArchiveStream = path.join(AH.paths.archivedSites, pathObjUrl.base);
  var fileStream = fs.createReadStream(publicUrl);

  fileStream.on('error', function (error) {
    console.log(error, '<-- this error came from fileStream.on error');
    // the requested page is not in public, is it in archives?
    var archiveStream = fs.createReadStream(giveToArchiveStream);

    archiveStream.on('error', function (error) {
      console.log(error, '<-- this error came from archiveStream.on error');

      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('file not found');
    });

    archiveStream.on('open', function() {
      // console.log('In archiveStream.on open');

      res.writeHead(200, {'Content-Type': mimeTypeOut});
    });

    archiveStream.on('end', function() {
      console.log('sent file ' + giveToArchiveStream);
    });

    archiveStream.pipe(res);

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
