var restify = require('restify');
var request = require('request');
var fs = require('fs');

// Setup some https server options
var https_options = {
  key: fs.readFileSync('/home/chris/keys/server.key'),
  certificate: fs.readFileSync('/home/chris/keys/server.crt')
};

var setup_server = function(app) {
  app.use(restify.queryParser());


  function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
  }

  // setup routes here

  app.get('/hello/:name', respond);

  //app.param('lang', /^\w{2}$/);
  app.get('/wikipedia/:lang', function(req, res, next){
    console.log('wikipedia req');
    // the search parameter name is 'srsearch'
    var lang = req.params.lang.toString().trim();

    // Question: put in quotes to search literally?
    var searchQuery = encodeURIComponent(req.query.srsearch);
    var query = '&srsearch=' + searchQuery;

    // removes the region from the language (if any)
    // en-US -> en, es-ES -> es
    var lang = lang.split('-')[0];
    var lang_host = 'http://' + lang + '.wikipedia.org';

    var path = '/w/api.php?action=query&format=json&list=search&srprop=snippet';

    var requestUrl = lang_host + path + query;

    var afterWikipedia = function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var results = JSON.parse(body).query.search;
        console.log(results);
        res.send(results);
        next();
      }
    }

    console.log(requestUrl);
    request(requestUrl, afterWikipedia);
  });

  //getJSON.getJSON(options,
  //	function(result) {
  //		var searchResults = result.query.search;
 //		res.json(searchResults);
//	});
//
//  });
}

// Instantiate an https and an http server
var http_server = restify.createServer();
var https_server = restify.createServer(https_options);

setup_server(http_server);
setup_server(https_server);

//server.head('/hello/:name', respond);

// Start our servers to listen on the appropriate ports
http_server.listen(8080, function() {
  console.log('%s listening at %s', http_server.name, http_server.url);
});

https_server.listen(8082, function() {
  console.log('%s listening at %s', https_server.name, https_server.url);
});




// the default https port is 443
// default http port is 80
//
//
