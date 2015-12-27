var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpR = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../web/archives/sites'),
  list: path.join(__dirname, '../web/archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// readListOfUrls is going to take the data it eventually gets, and run a callback on it
exports.readListOfUrls = function(pathToFile, callback) {
  fs.readFile(pathToFile, function(err, data){
    if (err) {
      return callback(err);
    }
    // console.log(data.toString(), ' <-- this is the data to String from readListOfUrls');
    var arrayed = data.toString().split(/\r?\n/);
    // console.log(data, ' <-- this is the data from readListOfUrls');
    callback(null, arrayed);
  });
};

// callback that has err and data expects to be called once, either with err or with data
// once one thing has an async callback pattern, everything that uses it needs an async callback pattern
// don't need returns because the callback takes care of managing information flow
// isUrlInList is going to take the data it eventually gets and run a callback on it
// callbacks are like oven mitts, async data like hot potato

exports.isUrlInList = function(pathToFile, urlInQuestion, callback){
  exports.readListOfUrls(pathToFile, function(err, data){
    if (err) {
      return callback(err);
    }

    // console.log(data, ' <-- this is data as seen in isUrlInList');
    var boo = _.contains(data, urlInQuestion);
    // console.log(boo, ' <-- this is the contains result in isUrlInList');
    callback(null, boo);
  });
};

exports.addUrlToList = function(fileToAddTo, dataToAdd){
  fs.appendFile(fileToAddTo, dataToAdd, function (err) {
    if (err) throw err;
    console.log(dataToAdd + ' was appended to ' + fileToAddTo);
  });
};

exports.isUrlArchived = function(pathToDir, urlPlusHtmlExt, callback){
  fs.readdir(pathToDir, function(err, extantFileArray){
    if (err) {
      return callback(err);
    }
    // once this is complete, it will have the extantFileArray
    // I'd like to compare that to a url
    // console.log(extantFileArray, 'in isUrlArchived, this is extantFileArray');
    var found = _.contains(extantFileArray, urlPlusHtmlExt);
    callback(null, found);
  });
  // Asynchronous readdir(3). Reads the contents of a directory. The callback gets two arguments (err, files) where files is an array of the names of the files in the directory excluding '.' and '..'.
};

exports.downloadUrls = function(){
  // make list of urls in text file that are not in dir
  exports.readListOfUrls(exports.paths.list, function(err, arrayedListedUrls){
    if (err) throw err;
    arrayedListedUrls.forEach(function(url){
      var urlPlusHtml = url + '.html';
      console.log(urlPlusHtml, 'in downloadUrls/readListOfUrls, this is url + html');
      exports.isUrlArchived(exports.paths.archivedSites, urlPlusHtml, function(err, isFound){
        var getThis;
        if (err) throw err;
        if (!isFound) {
          getThis = urlPlusHtml.slice(0, -5);
          if (getThis === '') {
            // this handles ignoring the newline \n character at the end of every sites.txt
            return;
          }
        }
        else {
          // this means if we found the site in the archives/sites dir, we won't go get it again
          return;
        }
        // console.log(urlPlusHtml, 'in downloadUrls/isUrlArchived, this is url parameter');
        console.log(getThis, 'in downloadUrls/isUrlArchived, this getThis (sliced if not found)');
        var getThisDecoded = decodeURIComponent(getThis);
        // console.log(getThisDecoded, 'in downloadUrls/isUrlArchived, getThis decoded?');
        var optionsObj = {
          url: getThisDecoded
        };
        console.log(optionsObj.url, 'in downloadUrls, this is optionsObj.url');
        var pathToFileToMake = exports.paths.archivedSites + '/' + urlPlusHtml;

        httpR.get(optionsObj, pathToFileToMake, function (err, res) {
          if (err) {
            console.error(err);
            return;
          }
          console.log(res.code, res.headers, res.file);
        });

      });
    });
  });
  // while list is populated
  //run get, pipe to writeStream
};

// HTTP GET method wrapper
// Parameters:
// Name  Type  Description
// options module:request~options | String The options Object taken by the Request constructor, filtered by module:tools.shortHand. options.method = 'GET' and it can not be overridden. If a String is passed, it is handled as options = {url: options}
// file  String | null Optional; specify a filesystem path to save the response body as file instead of Buffer. Passing null turns off the data listeners
// callback  module:main~callback  Completion callback

// optionsObj needs to have url filled in in AH
// http://saltwaterc.github.io/http-request/module-request.html#options

  // var postStream = fs.createReadStream(urlToFeedToPostStream);

  // postStream.on('error', function (error) {
  //   console.log(error, '<-- this error came from postStream.on error');

  //   res.writeHead(303, {'Content-Type': 'text/html', 'Location': 'public/loading.html'});
  //   res.end('file not found');
  // });

  // postStream.on('open', function() {
  //   console.log('In postStream.on open');

  //   res.writeHead(301, {'Content-Type': 'text/html'});
  // });

  // postStream.on('end', function() {
  //   console.log('sent file Post');
  // });

  // postStream.pipe(res);
