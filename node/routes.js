app = module.parent.exports.app;
db = module.parent.exports.db;

// Routes
app.get('/',
function(req, res) {
    console.log('/site/views/schedule.html');
    res.statusCode = 302;
    res.setHeader("Location", "/site/views/schedule.html");
    res.end();
});

app.get('/intl',
function(req, res) {
    console.log('/site/views/scheduleintl.html');
    res.statusCode = 302;
    res.setHeader("Location", "/site/views/scheduleintl.html");
    res.end();
});

app.get('/rest',
function(req, res) {
    console.log('/rest.html');
    res.statusCode = 302;
    res.setHeader("Location", "/rest.html");
    res.end();
});

app.get('/export', function (req, res) {
    var filename = 'ScheduleExport.csv';
    res.attachment(filename);
    res.end(req.query["csv_text"]);
});
