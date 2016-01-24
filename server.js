var path = require("path");
var express = require('express');
var async = require('async');
var fs = require('fs');
var app = express();

//app.use(express.basicAuth("horst", "heidi"));
console.log('process.env.PORT:' + process.env.PORT);
app.set('port', process.env.PORT || 8080);

// Puts the parsed body in req.body (used in POST to get the data)
app.use(express.bodyParser());

// We want anything under the public directory to be accessible
app.use(express.static('public'));

// http://localhost:8080/simpleserver/html/sample.html
app.get('/simpleserver/html/:filename', function (req, res) {
	console.log('req.params.filename=' + req.params.filename);
    serve_static_file('public/html/' + req.params.filename, res);
});

// http://localhost:8080/simpleserver/json/sample.json
app.get('/simpleserver/json/:filename', function (req, res) {
    console.log('req.params.filename=' + req.params.filename);
    serve_static_file('public/json/' + req.params.filename, res);
});

// POST data url
app.post('/simpleserver/postData', function (req, res) {
    console.log('\n#####  postData   #######');
    if (req.files) {
        var s = '';
        var keys = Object.keys(req.files);
        for (var i = 0; i < keys.length; i++) {
            var f = req.files[keys[i]];
            if (i > 0) {
                s += ', ';
            }
            s += f.name;
            console.log('POST Received File: ' + f.name + '   path on server: ' + f.path);
        }
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write('POST Data Received Files:\n\n' + s);
        res.end();
    } else {
        console.log(req.body);
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write('POST Data Received:\n\n' + JSON.stringify(req.body));
        res.end();
    }
});

app.get('/simpleserver', function (req, res) {
     serve_static_file('public/index.html', res);
});

app.get('*', four_oh_four);

function serve_static_file(file, res) {
    var rs = fs.createReadStream(file);
    rs.on(
        'error',
        function (e) {
            res.writeHead(404, { "Content-Type" : "application/json" });
            var out = { error: "not_found",
                        message: "'" + file + "' not found" };
            res.end(JSON.stringify(out) + "\n");
        }
    );
    var ct = content_type_for_file(file);
    res.writeHead(200, { "Content-Type" : ct });
    rs.pipe(res);
}

function content_type_for_file (file) {
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return "text/html";
        case ".js": return "text/javascript";
        case ".css": return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        case '.json': return 'application/json';
        default: return 'text/plain';
    }
}

function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

function send_success(res, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
}


function send_failure(res, code, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}


function invalid_resource() {
    return make_error("invalid_resource",
                      "the requested resource does not exist.");
}

function four_oh_four(req, res) {
    send_failure(res, 404, invalid_resource());
}

function send_failure(res, code, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}

///app.listen(8080);
/*app.listen(8080, function() {
    console.log('Server up and listening: http://localhost:8080...');
});*/

var server = app.listen(app.get('port'), function() {
    console.log('Apiary Mock Server up: http://localhost:' + app.get('port'));
});