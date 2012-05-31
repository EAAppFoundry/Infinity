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

require('./site/codebase/date.format.js');

app.listen(3000, function() {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

module.exports.app = app;
module.exports.db = db;
routes = require("./routes");
scheduleRoutes = require("./scheduleroutes");
networkRoutes =  require("./networkroutes");