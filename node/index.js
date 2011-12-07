var http = require('http');
var mongoose = require('mongoose');

var Network = require('./network.js');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
 
  mongoose.connect('mongodb://scheduling:scheduling@ds029117.mongolab.com:29117/scheduling');

  Network.find( {}, function( err, networks ) {
	for( var i = 0; i < networks.length; i++ )
		res.write('Name: ' + networks[i].Name + '\n' );
	res.end();
  });

  mongoose.disconnect();

}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');
