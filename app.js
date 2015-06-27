var apiToken = process.env.UWAPI;
var uwapi = require('uwapi')(apiToken);
var fs = require('fs');
var http = require("http");

var obj;
fs.readFile('data.txt', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
});

var lookupBuilding = function(location, callback){
    uwapi.buildings({"building_acronym":location}).then(function(building) {
        if(building.latitude != null && building.longitude != null){
            callback(building);
        }
        else {
            callback(null);
        }
    }).catch(function(err){
        console.log(err);
    });
}

var lookupGroup = function(parsedBody, callback){
    var location = null;
    for(var i = 0; i < obj.length; i++){
        if(obj[i].code == parsedBody.code){
            location = obj[i].location;
        }
    }
    callback(location);
}

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.post('/lookup', function (req, res) {
    lookupGroup(req.body, function(location){
        if(location == null){
            res.status(404).send(JSON.stringify({"message":"No study group found."}));
        }
        else{
            lookupBuilding(location, function(building){
                if(building == null){
                    res.status(404).send(JSON.stringify({"message":"No building found."}));
                }
                else{
                    res.status(200).send(JSON.stringify({
                        "latitude": building.latitude,
                        "longitude": building.longitude
                    }));
                }
            });
        }
    });
});

app.post('/create', function(req, res){
    if(req.body.code != null && req.body.location != null){
        obj.push(req.body);
        res.status(200).send(JSON.stringify({"message":"Successfully added new study group."}));
    }
    else{
        res.status(404).send(JSON.stringify({"message":"Missing parameters."}));
    }
});


var path = require('path');
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

var server = app.listen(port, function() {
    var lhost = server.address().address;
    var lport = server.address().port;

    console.log('Example app listening at http://%s:%s', lhost, lport);
});