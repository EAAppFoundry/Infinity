app = module.parent.exports.app;
db = module.parent.exports.db;

require('./schema');
var Network = db.model('Network', Network, 'network');
var NetworkWithFeeds = db.model('NetworkWithFeeds', NetworkWithFeeds, 'networkwithfeeds');

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
        var staticPath = './images/networks/';
        var tempPath;
        // foreach on each row
        for (i = 0; i <= (networks.length - 1); i++)
        {
            tempPath = staticPath + networks[i].Code + '.png';
            networks[i].LogoUrl = tempPath.toLowerCase();
        }

        res.contentType('application/json');
        res.json(networks);
    });
});

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

app.get('/networks/feedcode',
function(req, res) {
    console.log('/networks/feedcode');
    NetworkWithFeeds.find({}).sort('Code', 'ascending').execFind(
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

function fileExists(filePath) {
    try
    {
        require('fs').statSync(filePath);
    }
    catch(err)
    {
        return false;
    }
    return true;
}