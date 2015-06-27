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

var server = http.createServer(function(request, response) {

    if (request.method == "POST"){
        request.on("data", function(jsonBody){
            var parsedBody = JSON.parse(jsonBody);
            response.writeHead(200, {
                "Content-Type": "plain/text",
                "Access-Control-Allow-Origin": "*",
                "Content-Language":"utf-8"
            });

            lookupGroup(parsedBody, function(location){
                if(location == null){
                    response.write(JSON.stringify({"message":"No study group found."}));
                    response.end();
                }
                else{
                    lookupBuilding(location, function(building){
                        if(building == null){
                            response.write(JSON.stringify({"message":"No building found."}));
                            response.end();
                        }
                        else{
                            response.write(JSON.stringify({
                                "latitude": building.latitude,
                                "longitude": building.longitude
                            }));
                            response.end();
                        }
                    });
                }
            });
        });
    }
});

server.listen(8080);
console.log("Server is listening");