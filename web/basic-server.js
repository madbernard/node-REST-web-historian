var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
// gitignore ignores the local storage stuff, archives/sites/ and archives/sites.txt
initialize();

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);

// this module.parent thing is explained a bit in here:
// http://stackoverflow.com/questions/13651945/what-is-the-use-of-module-parent-in-node-js-how-can-i-refer-to-the-requireing
// "The "parent" is the module that caused the script to be interpreted (and cached), if any:"
// so the line below checks if something else called for the basic-server module
// I have no idea what would call for the server...  Looks like one of the tests calls it.
if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log("Listening on http://" + ip + ":" + port);
}

