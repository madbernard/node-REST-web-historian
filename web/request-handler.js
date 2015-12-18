
//The MODULES we require:
var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
// var server = require('./basic-server.js');
var httpr = require("http-request");
var urlr = require('url');
var httpHelpers = require('./http-helpers');


//Our handleRequest
exports.handleRequest = function (req, res) {
  var getUrl = urlr.parse(req.url).pathname;
  // if(getUrl === '/'){
  //   getUrl = '/index.html';
  // }
  console.log(getUrl, "<--- this is the parsed URL");
  console.log(req.url, "<--- this is the request url");

  var statusCode = 200;
  res.writeHead(statusCode, "200 okay!", httpHelpers.headers);

  //check if request method is a GET
  if(req.method === 'GET'){
    // //fs.readdir(path, callback)
    // Reads the contents of a directory. The callback gets two arguments (err, files) where files is an array of the names of the files in the directory excluding '.' and '..'.
    fs.readdir(archives.path.siteAssets, function(err, files){
      //give an error
      if (err) throw err;
      //check if the file is a file we can find in the
    });

    getUrl = urlr.parse(req.url).pathname;

    if(getUrl === '/'){
      fs.readFile(archive.paths.siteAssets + '/index.html', function (err, logData) {
        if (err) throw err;

        var text = logData.toString();
        // console.log(text);
        // sendThisBack = text;
        res.end(text);
      });
    }
  }

  //check if the request method is a POST
  if(req.method === 'POST'){
    var collectedData = "";
    // console.log(collectedData, "in POST, first appearance of collectedData");
    //302 for found
    statusCode = 302;
    req.on("data", function(chunk){
      collectedData += chunk;
    });
    req.on("end", function(){
      // probably we need to store only the url, not url=theurl.com <--figure this out?
      console.log(collectedData, "in POST, where collectedData should be complete");
      // var cleanedData = /url=(.*)/.exec(collectedData);
      // console.log(cleanedData, "cleanedData array?");
      // var cleanedUrl = cleanedData[1];
      // check if URL is in archived list (text or sites?) <--OK
      archive.isUrlInList(collectedData, function(isFound){
        //if URL is in list (text) <--OK
        if (isFound) {
          // check that URL is in /sites/ <--maybe we can figure this out?
            // if URL is in /sites/
              // we put the person on our version of that URL:
              // we serve them sites/storedthing.html
          // if URL is not yet downloaded <--maybe we can figure this out?
            // loading page is served to person <--DO THIS
        }
        // if URL is not in list,
        else {
          // POST process here will call out to that URL <--how done?
          // HTTP-REQUEST (GET) <--how done?
          // async
          httpr.get('https://www.google.com/', function (err, res) {
            if (err) {
              console.error(err);
              return;
            }
      //console.log(res.code, res.headers, res.buffer.toString());
          });
          // once that returns, add to /sites/ <--maybe we can figure this out?
          // we use fs to store it on our hard drive
          // add url to txt file <--OK
          archive.addUrlToList(collectedData);
          // meanwhile it returns the person the "loading.html" page <--DO THIS
          fs.readFile(archive.paths.siteAssets + '/loading.html', function (err, logData) {
            if (err) throw err;
            var statusCode = 200;
            res.writeHead(statusCode, "200 okay!", httpHelpers.headers);
            var text = logData.toString();
            res.end(text);
          });
        }
      });

//NOTES from TownHall:
// From Adam to Everyone: (03:25 PM)
// you would send a 302 response code with headers that tell the browser where to go
// From Kristen Haydel to Everyone: (03:25 PM)
// great. thank you
// backbone?
// From Adam to Everyone: (03:26 PM)
// adding "location":"url/goes/here" to the headers
// From brendan to Everyone: (03:27 PM)
// @adam that’s what we did
// From Becky Jaimes to Everyone: (03:27 PM)
// in TWO weeks :D
// From brendan to Everyone: (03:27 PM)
// though Location was capitalized… not sure if it matters

      res.writeHead(statusCode, "302 found", httpHelpers.headers);
      res.end();
    });
  }

};
