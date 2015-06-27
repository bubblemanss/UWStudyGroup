var apiToken = process.env.UWAPI;
var uwapi = require('uwapi')(apiToken);
var fs = require('fs');
var http = require("http");

var obj;
fs.readFile('data.txt', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
});

var lookupBuilding = function(locations, count, buildings, callback){
    if(count == locations.length){
        callback(buildings);
    }
    else{
        uwapi.buildings({"building_acronym":locations[count].building}).then(function(building) {
            if(building.latitude != null && building.longitude != null){
                buildings.push(building);
                lookupBuilding(locations, count+1, buildings, callback);
            }
            else {
                callback(null);
            }
        }).catch(function(err){
            console.log(err);
        });
    }
}

var lookupGroup = function(parsedBody, callback){
    var buildings = [];
    for(var i = 0; i < obj.length; i++){
        if(obj[i].code == parsedBody.code){
            buildings.push(obj[i]);
        }
    }
    callback(buildings);
}

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.post('/lookup', function (req, res) {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    })
    lookupGroup(req.body, function(locations){
        if(locations.length == 0){
            res.status(404).send(JSON.stringify({"message":"No study group found."}));
        }
        else{
            lookupBuilding(locations, 0, [], function(buildings){
                if(buildings == null){
                    res.status(404).send(JSON.stringify({"message":"No building found for one of the inputs."}));
                }
                else{
                    var responseBody = [];
                    for(var i = 0; i < buildings.length; i++){
                        var temp = {
                            "type": "Student",
                            "latitude": buildings[i].latitude,
                            "longitude": buildings[i].longitude,
                            "building": locations[i].building,
                            "room": locations[i].room,
                            "code": locations[i].code,
                            "people": locations[i].people
                        }
                        responseBody.push(temp);
                    }
                    res.status(200).send(JSON.stringify(responseBody));
                }
            });
        }
    });
});

app.post('/create', function(req, res){
    if(req.body.code != null && req.body.building != null && req.body.room != null && req.body.people != null){
        obj.push(req.body);
        res.status(200).send(JSON.stringify({"message":"Successfully added new study group."}));
    }
    else{
        res.status(404).send(JSON.stringify({"message":"Missing parameters."}));
    }
});

app.use(express.static(__dirname + '/public'));

var server = app.listen(port, function() {
    var lhost = server.address().address;
    var lport = server.address().port;

    console.log('Example app listening at http://%s:%s', lhost, lport);
});