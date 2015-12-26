// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var httpR = require('http-request');

// HTTP GET method wrapper
// Parameters:
// Name  Type  Description
// options module:request~options | String The options Object taken by the Request constructor, filtered by module:tools.shortHand. options.method = 'GET' and it can not be overridden. If a String is passed, it is handled as options = {url: options}
// file  String | null Optional; specify a filesystem path to save the response body as file instead of Buffer. Passing null turns off the data listeners
// callback  module:main~callback  Completion callback

// optionsObj needs to have url filled in in AH
// http://saltwaterc.github.io/http-request/module-request.html#options
var optionsObj = {
  url: options,
  method: 'GET',
  stream: true
};

// file created needs to be named from AH
// file should just be named why7.com.html, example.com.html, etc
http.get(optionsObj, fileToMake, function (err, res) {
  if (err) {
    console.error(err);
    return;
  }

  console.log(res.code, res.headers, res.file);
});