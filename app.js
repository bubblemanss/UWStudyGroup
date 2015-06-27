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
    for(var i = 0; i < obj.length; i++){
        if(obj[i].code == parsedBody.code){
            callback(obj[i].location);
        }
    }
}

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.post('/', function (req, res) {

    lookupGroup(req.body, function(location){
        if(location == null){
            res.send(JSON.stringify({"message":"No study group found."}));
        }
        else{
            lookupBuilding(location, function(building){
                if(building == null){
                    res.send(JSON.stringify({"message":"No building found."}));
                }
                else{
                    res.send(JSON.stringify({
                        "latitude": building.latitude,
                        "longitude": building.longitude
                    }));
                }
            });
        }
    });
});

var server = app.listen(port, function() {
    var lhost = server.address().address;
    var lport = server.address().port;

    console.log('Example app listening at http://%s:%s', lhost, lport);
});

//var server = http.createServer(function(request, response) {
//
//    if (request.method == "POST"){
//        request.on("data", function(jsonBody){
//            var parsedBody = JSON.parse(jsonBody);
//            response.writeHead(200, {
//                "Content-Type": "plain/text",
//                "Access-Control-Allow-Origin": "*",
//                "Content-Language":"utf-8"
//            });
//
//            lookupGroup(parsedBody, function(location){
//                if(location == null){
//                    response.write(JSON.stringify({"message":"No study group found."}));
//                    response.end();
//                }
//                else{
//                    lookupBuilding(location, function(building){
//                        if(building == null){
//                            response.write(JSON.stringify({"message":"No building found."}));
//                            response.end();
//                        }
//                        else{
//                            response.write(JSON.stringify({
//                                "latitude": building.latitude,
//                                "longitude": building.longitude
//                            }));
//                            response.end();
//                        }
//                    });
//                }
//            });
//        });
//    }
//});
//
//server.listen(8080);
//console.log("Server is listening");