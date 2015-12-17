var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
// var server = require('./basic-server.js');
var httpr = require("http-request");

//require http helper files
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (req, res) {

  console.log(req.url, "<--- this is the request url");
  var statusCode = 200;
  res.writeHead(statusCode, "200 okay!", httpHelpers.headers);

  var sendThisBack;

  // PERSON GOES TO INDEX.HTML  <--OK
    // gets served index.html, woo! <--OK
  // person types in a url <--OK
  // url goes to POST processing here <--OK
    // probably we need to store only the url, not url=theurl.com <--DO THIS
    // check if URL is in archived list (text or sites?) <--DO THIS
      // if not, POST process here will call out to that URL <--how done?
      // add url to txt file <--OK
      // HTTP-REQUEST (GET) <--how done?
      // async
        // once that returns, add to /sites/ <--maybe we can figure this out?
        // we use fs to store it on our hard drive
      // meanwhile it returns the person the "loading.html" page <--DO THIS
    //if URL is in list (text) <--DO THIS
      // check that URL is in /sites/ <--maybe we can figure this out?
        // if URL is in /sites/
          // we put the person on our version of that URL:
          // we serve them sites/storedthing.html
      // if URL is not yet downloaded <--maybe we can figure this out?
        // loading page is served to person <--DO THIS


  if(req.method === 'GET'){
    fs.readFile(archive.paths.siteAssets + '/index.html', function (err, logData) {
      if (err) throw err;

      var text = logData.toString();
      // console.log(text);
      // sendThisBack = text;
      res.end(text);
    });
  }

  if(req.method === 'POST'){
  //   var collectedData = "";
  //   // console.log(collectedData, "in POST, first appearance of collectedData");
  //   //302 for found
    statusCode = 302;
  //   req.on("data", function(chunk){
  //     collectedData += chunk;
  //   });
  //   req.on("end", function(){
  //     // probably we need to store only the url, not url=theurl.com <--DO THIS

  //     console.log(collectedData, "in POST, where collectedData should be complete");
  //     // check if URL is in archived list (text or sites?) <--DO THIS

  //       // if not,
  //         // POST process here will call out to that URL <--how done?
  //         // HTTP-REQUEST (GET) <--how done?
  //         // async
  //           // once that returns, add to /sites/ <--maybe we can figure this out?
  //           // we use fs to store it on our hard drive
  //         // add url to txt file <--OK
  //         archive.addUrlToList(collectedData);
  //         // meanwhile it returns the person the "loading.html" page <--DO THIS

  //       //if URL is in list (text) <--DO THIS

  //         // check that URL is in /sites/ <--maybe we can figure this out?

  //           // if URL is in /sites/
  //             // we put the person on our version of that URL:
  //             // we serve them sites/storedthing.html
  //         // if URL is not yet downloaded <--maybe we can figure this out?

  //           // loading page is served to person <--DO THIS

  //     res.writeHead(statusCode, "302 found", httpHelpers.headers);
  //     res.end();
  //   });
  // }
// require the basic.server.js, then we can use this
    httpr.get('https://www.google.com/', function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(res.code, res.headers, res.buffer.toString());
    });
        res.writeHead(statusCode, "302 found", httpHelpers.headers);
        res.end();
 }
//npm install http-request --save

  // what we want is to use GET method of http-request, probably
  // add requirement for that tomorrow
  //figure it out
  // res.end(sendThisBack);
};
