/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();

// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/'));
});

app.configure('development',
function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production',
function() {
    app.use(express.errorHandler());
});

// Routes
var mongoose = require("mongoose");

var db = mongoose.connect('mongodb://scheduling:scheduling@ds029117.mongolab.com:29117/scheduling',
//var db = mongoose.connect('mongodb://scheduling:scheduling@localhost:27017/scheduling',
function(err) {
    if (err) {
        //        console.log('err');
        throw err;
    }
    //    console.log("success");
});

mongoose.connection.on("open",
function() {
    //    console.log("mongodb is connected!!");
    });

mongoose.connection.on("close",
function() {
    //    console.log("mongodb is closed!!");
    });

var fs = require('fs'),
index;

fs.readFile('./index.html',
function(err, data) {
    if (err) {
        throw err;
    }
    index = data;
});

app.get('/index.html',
function(req, response) {
    response.writeHeader(200, {
        "Content-Type": "text/html"
    });
    response.write(index);
    response.end();
});

require('./schema');
var Schedule = db.model('Schedule', Schedule, 'schedule');
var Network = db.model('Network', Network, 'network');

app.get('/networks',
function(req, res) {
    Network.find({},
    function(err, networks) {
        if (err) {
            throw err;
        }
        res.contentType('application/json');
        res.json(networks);
    });
});

app.get('/networks/:id',
function(req, res) {
    Network.findById(req.params.id,
    function(err, networks) {
        if (err) {
            throw err;
        }
        res.contentType('application/json');
        res.json(networks);
    });
});

app.get('/schedules/schedule?',
function(req, res) {
	
    var stDate = require('url').parse(req.url, true).query.startdate;
	var endDate = require('url').parse(req.url, true).query.enddate;
    if (stDate != undefined)
    {
	
		var startDate = new Date(unescape(stDate.toString()).replace(/'/gi,""));
		
        var endDate = new Date(endDate == undefined ? startDate : unescape(endDate.toString()).replace(/'/gi,""));
        
        console.log(startDate.toLocaleString());
        console.log(endDate.toLocaleString());

	    Schedule.find( {$nor: [
							{'StartDate': {$gt : endDate}},
							{'EndDate': {$lt : startDate}}
						]},
		
			//{$and: [ $not:{'StartDate' : {$gt : endDate}}, $not:{'EndDate' : {$lt : startDate}}] },
		function(err, schedules) {
	        if (err) {
	            throw err;
	        }
			console.log(schedules.length);
	        res.contentType('application/json');
	        res.json(schedules);
	    });
    }

    var network = require('url').parse(req.url, true).query.network;
    if (network != undefined)
    {
	    Schedule.find({'Network' : network },
	    function(err, schedules) {
	        if (err) {
	            throw err;
	        }
	        res.contentType('application/json');
	        res.json(schedules);
	    });
    }

    var platform = require('url').parse(req.url, true).query.platform;
    if (platform != undefined)
    {
	    Schedule.find({'Platform' : platform },
	    function(err, schedules) {
	        if (err) {
	            throw err;
	        }
	        res.contentType('application/json');
	        res.json(schedules);
	    });
    }

    var source = require('url').parse(req.url, true).query.source;
    if (source != undefined)
    {
	    Schedule.find({'Source' : source },
	    function(err, schedules) {
	        if (err) {
	            throw err;
	        }
	        res.contentType('application/json');
	        res.json(schedules);
	    });
    }
	
});

app.get('/schedules',
function(req, res) {
    Schedule.find({},
    function(err, schedules) {
        if (err) {
            throw err;
        }
        res.contentType('application/json');
        res.json(schedules);
    });
});

app.get('/schedules/:id',
function(req, res) {
    Schedule.findById(req.params.id,
    function(err, schedules) {
        if (err) {
            throw err;
        }
        res.contentType('application/json');
        res.json(schedules);
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
