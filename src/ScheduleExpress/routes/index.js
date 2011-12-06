/*
 * GET home page.
 */
var mongoose = require("mongoose");

var db = mongoose.connect('mongodb://scheduling:scheduling@ds029117.mongolab.com:29117/scheduling',
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
/*
find('network', {
    'Name': 'Cartoon'
},
function(err, docs) {
    if (err) {
        mongoose.disconnect();
        throw err;
    }

    console.dir(docs);
});

function find(collec, query, callback) {
    mongoose.connection.authenticate('scheduling', 'scheduling', function(){})
	mongoose.connection.db.collection(collec,
    function(err, collection) {
        if (err) {
            mongoose.disconnect();
            throw err;
        }

        collection.find(query).toArray(callback);
    });
}
*/

require('../schema.js');
var Schedule = db.model('Schedule', Schedule, 'schedule');
var Network = db.model('Network', Network, 'network');

exports.index = function(req, res) {
    Network.count(
    function(err, count) {
        if (err) throw err;
        console.log("Records:", count);
    })

    Network.find({},
    function(err, networks) {
        if (err) {
            throw err;
        }

        res.render('index', {
            networks: networks
        });
    });
};