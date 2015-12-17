var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var http = require("http");

//require http helper files
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (req, res) {

  console.log(req.url, "<--- this is the request url");
  var statusCode = 200;
  res.writeHead(statusCode, "200 okay!", httpHelpers.headers);

  var sendThisBack;

  // when there's a get request to something that we don't have in our text file
  // we have to go there:  server sends a get request to that URL
    // HERE WE ARE WORKING ON THE ABOVE
  // we get back html data
  // we use fs to store it on our hard drive
  // then next time we get it from the hard drive
  // and send it back to teh client


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
    var collectedData = "";
    // console.log(collectedData, "in POST, first appearance of collectedData");
    //302 for found
    statusCode = 302;
    req.on("data", function(chunk){
      collectedData += chunk;
    });
    req.on("end", function(){
      //take the url and write it to sites.txt
      archive.addUrlToList(collectedData);
      //log data
      console.log(collectedData, "in POST, where collectedData should be complete");
      res.writeHead(statusCode, "201 sent", httpHelpers.headers);
      res.end();
    });
  }


  // what we want is to use GET method of http-request, probably
  // add requirement for that tomorrow
  //figure it out
  // res.end(sendThisBack);
};
