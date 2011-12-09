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

var mongoose = require("mongoose");

var db = mongoose.connect(require('./config').mongoConfig,
function(err) {
    if (err) {
        console.log('err');
        throw err;
    }
});

app.get('/export', function (req, res) {
    //console.log('export');

    var filename = 'ScheduleExport.csv';
    res.attachment(filename);
    //console.log('res.end');
    res.end(req.query["csv_text"]);
});

require('./schema');
require('./site/codebase/date.format.js');
var Schedule = db.model('Schedule', Schedule, 'schedule');
var Network = db.model('Network', Network, 'network');

// Params
app.param('network',
function(req, res, next, network) {
    req.network = network;
    next();
});

app.param('platform',
function(req, res, next, platform) {
    req.platform = platform;
    next();
});

app.param('source',
function(req, res, next, source) {
    req.source = source;
    next();
});

app.param('startdate',
function(req, res, next, startdate) {
    req.startdate = startdate;
    next();
});

app.param('enddate',
function(req, res, next, enddate) {
    req.enddate = enddate;
    next();
});

// Routes
app.get('/',
function(req, res) {
    console.log('/rest');
    res.statusCode = 302;
    res.setHeader("Location", "/site/views/schedule.html");
    res.end();
});

app.get('/rest',
function(req, res) {
    console.log('/rest');
    res.statusCode = 302;
    res.setHeader("Location", "/rest.html");
    res.end();
});

app.get('/networks',
function(req, res) {
    console.log('/networks');
    Network.find({}).sort('Code', 'ascending').execFind(
    function(err, networks) {
        if (err) {
            throw err;
        }
        res.contentType('application/json');
        res.json(networks);
    });
});

app.get('/networks/images',
function(req, res) {
    console.log('/networks/images');
    Network.find({}).sort('Code', 'ascending').execFind(
    function(err, networks) {
        if (err) {
            throw err;
        }
        var staticPath = './site/views/';
        var tempPath;
        // foreach on each row
        for (i = 0; i <= (networks.length - 1); i++)
        {
            tempPath = staticPath + networks[i].LogoUrl;

			// this is synchronous so it will be slower
			if(!fileExists(tempPath))
			{
				networks[i].LogoUrl = '';
			}
        }
        res.contentType('application/json');
        res.json(networks);
    });
});

function fileExists(filePath) {
	try
	{
		require('fs').statSync(filePath)
	}
	catch(err)
	{
		return false;
	}
	return true;
}

app.get('/networks/turneronly',
function(req, res) {
    console.log('/networks/turneronly');
    Network.find({
        'IsTurnerNetwork': true
    }).sort('Code', 'ascending').execFind(
    function(err, networks) {
        if (err) {
            throw err;
        }
        res.contentType('application/json');
        res.json(networks);
    });
});

app.get('/networks/notturner',
function(req, res) {
    console.log('/networks/notturner');
    Network.find({
        'IsTurnerNetwork': false
    }).sort('Code', 'ascending').execFind(
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
    console.log('/networks/:id');
    Network.findById(req.params.id,
    function(err, networks) {
        if (err) {
            throw err;
        }
        res.contentType('application/json');
        res.json(networks);
    });
});

app.get('/schedules/platform/:platform',
function(req, res) {
    console.log('/schedules/platform/:platform');
    Schedule.find({
        'Platform': req.platform
    },
    function(err, schedules) {
        if (err) {
            throw err;
        }
        res.contentType('application/json');
        res.json(schedules);
    });
});

app.get('/schedules/source/:source',
function(req, res) {
    console.log('/schedules/source/:source');
    Schedule.find({
        'Source': req.source
    },
    function(err, schedules) {
        if (err) {
            throw err;
        }
        res.contentType('application/json');
        res.json(schedules);
    });
});

app.get('/schedules/network/turneronly/today',
function(req, res) {
    console.log('/schedules/network/turneronly/today');
    //Get turner only networks
    Network.find({
        'IsTurnerNetwork': true
    }).sort('Code', 'ascending').execFind(
    function(err, networks) {
        if (err) {
            throw err;
        }
		var netArray = new Array();
		for (i = 0; i <= (networks.length - 1); i++)
        {
			netArray[i] = networks[i].Name;
        }
        
        // Get schedules for today based on
	    var today = new Date();

	    var startDate = new Date();
	    startDate.setUTCDate(today.getDate());
	    startDate.setUTCHours(0);
	    startDate.setUTCMinutes(0);
	    startDate.setUTCSeconds(0);

	    var endDate = new Date();
	    endDate.setUTCDate(today.getDate());
	    endDate.setUTCHours(23);
	    endDate.setUTCMinutes(59);
	    endDate.setUTCSeconds(29);

	    Schedule.find({
	        $or: [
	        {
	            'StartDate': {
	                $gte: startDate.toISO(),
	                $lte: endDate.toISO()
	            }
	        },
	        {
	            'EndDate': {
	                $gte: startDate.toISO(),
	                $lte: endDate.toISO()
	            }
	        }
	        ],
	        'Network': {$in : netArray}
	    }).sort('StartDate', 'ascending').execFind(
	    function(err, schedules) {
	        if (err) {
	            throw err;
	        }

	        res.contentType('application/json');
	        res.json(schedules);
	    });
    });
});

app.get('/schedules/network/:network',
function(req, res) {
    console.log('/schedules/network/:network');
    Schedule.find({
        'Network': req.network
    }).sort('StartDate', 'ascending').execFind(
    function(err, schedules) {
        if (err) {
            throw err;
        }

        res.contentType('application/json');
        res.json(schedules);
    });
});

app.get('/schedules/network/:network/today',
function(req, res) {
    console.log('/schedules/network/:network/today');
    var today = new Date();

    var startDate = new Date();
    startDate.setUTCDate(today.getDate());
    startDate.setUTCHours(0);
    startDate.setUTCMinutes(0);
    startDate.setUTCSeconds(0);

    var endDate = new Date();
    endDate.setUTCDate(today.getDate());
    endDate.setUTCHours(23);
    endDate.setUTCMinutes(59);
    endDate.setUTCSeconds(29);

    Schedule.find({
        $or: [
        {
            'StartDate': {
                $gte: startDate.toISO(),
                $lte: endDate.toISO()
            }
        },
        {
            'EndDate': {
                $gte: startDate.toISO(),
                $lte: endDate.toISO()
            }
        }
        ],
        'Network': req.network
    }).sort('StartDate', 'ascending').execFind(
    function(err, schedules) {
        if (err) {
            throw err;
        }

        res.contentType('application/json');
        res.json(schedules);
    });
});

app.get('/schedules/network/:network/startdate/:startdate',
function(req, res) {
    console.log('/schedules/network/:network/startdate/:startdate');

    var startDate = new Date(req.startdate);
    startDate.setUTCHours(0);
    startDate.setUTCMinutes(0);
    startDate.setUTCSeconds(0);

    var endDate = new Date(startDate);
    endDate.setUTCHours(23);
    endDate.setUTCMinutes(59);
    endDate.setUTCSeconds(29);

    Schedule.find(
    {
        'StartDate': {
            $gte: startDate.toISO(),
            $lte: endDate.toISO()
        },
        'Network': req.network
    }).sort('StartDate', 'ascending').execFind(
    function(err, schedules) {
        if (err) {
            throw err;
        }

        res.contentType('application/json');
        res.json(schedules);
    });
});

app.get('/schedules/startdate/:startdate/enddate/:enddate',
function(req, res) {
    console.log('/schedules/startdate/:startdate/enddate/:enddate');
    var stDate = req.startdate;
    var endDate = req.enddate;
    if (stDate != undefined)
    {
        var startDate = new Date(unescape(stDate.toString()).replace(/'/gi, "")).toISO();
        var endDate = new Date(endDate == undefined ? startDate: unescape(endDate.toString()).replace(/'/gi, "")).toISO();

        Schedule.find({
            $or: [
            {
                'StartDate': {
                    $gte: startDate,
                    $lte: endDate
                }
            },
            {
                'EndDate': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
            ]
        }).sort('StartDate', 'ascending').execFind(
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
    console.log('/schedules');
    Schedule.find({}).sort('StartDate', 'ascending').execFind(
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
    console.log('/schedules/:id');
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
