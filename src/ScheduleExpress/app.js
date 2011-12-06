
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
var mongoose = require("mongoose");

var db = mongoose.connect('mongodb://scheduling:scheduling@ds029117.mongolab.com:29117/scheduling',
//var db = mongoose.connect('mongodb://scheduling:scheduling@localhost:27017/scheduling',
function(err) {
    if (err) {
        console.log('err');
        throw err;
    }
    console.log("success");

});

mongoose.connection.on("open",
function() {
    console.log("mongodb is connected!!");
});

mongoose.connection.on("close",
function() {
    console.log("mongodb is closed!!");
});

require('./schema');
var Schedule = db.model('Schedule', Schedule, 'schedule');
var Network = db.model('Network', Network, 'network');

app.get('/networks',function(req, res) {
    Network.find({},
    function(err, networks) {
        if (err) {
            throw err;
        }
		console.log(networks);
		res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(networks.toString());
        res.end();
    });
});

app.get('/networks/:id',function(req, res) {
    Network.findById(req.params.id,
    function(err, networks) {
        if (err) {
            throw err;
        }
		console.log(networks);
		res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(networks.toString());
        res.end();
    });
});

app.get('/schedules',function(req, res) {
    Schedule.find({},
    function(err, schedules) {
        if (err) {
            throw err;
        }
		console.log(schedules);
		res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(schedules.toString());
        res.end();
    });
});

app.get('/schedules/:id',function(req, res) {
    Schedule.findById(req.params.id,
    function(err, schedules) {
        if (err) {
            throw err;
        }
		console.log(schedules);
		res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(schedules.toString());
        res.end();
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);