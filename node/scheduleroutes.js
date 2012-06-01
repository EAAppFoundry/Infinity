app = module.parent.exports.app;
db = module.parent.exports.db;
var moment = require('moment');

require('./schema');
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
		var startDate = moment().sod().toDate();
        var endDate = moment().eod().toDate();

        Schedule.find({
	        'Platform': 'Linear',
            'Source': 'Linear',
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

	var startDate = moment().sod().toDate();
    var endDate = moment().eod().toDate();

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
    if (stDate !== undefined)
    {
        var startDate = new Date(unescape(stDate.toString()).replace(/'/gi, "")).toISO();
        endDate = new Date(endDate === undefined ? startDate: unescape(endDate.toString()).replace(/'/gi, "")).toISO();

        Schedule.find({
            $or: [
            {
                'StartDate': {
                    $gte: startDate,
                    $lt: endDate
                }
            },
            {
                'EndDate': {
                    $gt: startDate,
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

app.get('/schedules/network/:network/platform/:platform/source/:source/startdate/:startdate/enddate/:enddate',
function(req, res) {
    console.log('/schedules/network/:network/platform/:platform/source/:source/startdate/:startdate/enddate/:enddate');
    var stDate = req.startdate;
    var endDate = req.enddate;
    if (stDate !== undefined)
    {
        var startDate = new Date(unescape(stDate.toString()).replace(/'/gi, "")).toISO();
        endDate = new Date(endDate === undefined ? startDate: unescape(endDate.toString()).replace(/'/gi, "")).toISO();

        Schedule.find({
            'Network': req.network,
            'Platform': req.platform,
            'Source': req.source,
            $or: [
            {
                'StartDate': {
                    $gte: startDate,
                    $lt: endDate
                }
            },
            {
                'EndDate': {
                    $gt: startDate,
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
