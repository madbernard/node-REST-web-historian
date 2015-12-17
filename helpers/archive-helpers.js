var fs = require('fs');
var path = require('path');
var _ = require('underscore');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

// other places call this archive.paths.list ...etc
exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// http://blog.modulus.io/absolute-beginners-guide-to-nodejs
exports.readListOfUrls = function(callback){
  var urlArray;
  // read from the list
  // Read the contents of the file into memory.
  fs.readFile(exports.paths.list, function (err, logData) {

    // If an error occurred, throwing it will
    // display the exception and kill our app.
    if (err) throw err;

    // logData is a Buffer, convert to string.
    var text = logData.toString();
    console.log(text);

    urlArray = text.split('\n');
    console.log(urlArray);

    // pass the results of the read to the callback as a parameter of the callback
    callback(urlArray);
  });
};

exports.isUrlInList = function(url){
  return _.contains(urlArray, url);
};

exports.addUrlToList = function(data){
  var plusNewLine = data + "\n";
  fs.appendFile(exports.paths.list, plusNewLine, function(err){
    if (err) throw err;
    console.log('The "data to append"' + data + 'was appended to the file');
    });
};

exports.isUrlArchived = function(){
};

exports.downloadUrls = function(){
};
