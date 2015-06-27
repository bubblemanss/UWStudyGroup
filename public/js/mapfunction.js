var map;
var pos;
var markers = [];

function initialize() {
    var mapOptions = {
        scaleControl: true,
        streetViewControl: false,
        zoom: 16
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
            markers.push(marker);

            map.setCenter(pos);
        },function () {
            handleNoGeolocation(true);
        });
    }
    else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}

function contentFormat(body){
    JSON.stringify({
        "type": body.type,
        "building": body.building,
        "room": body.room,
        "code": body.code,
        "people": body.people
    })
}

function addMarker(data) {
    var location = new google.maps.LatLng(data.latitude, data.longitude);

    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
    map.panTo(location);

    var infowindow = new google.maps.InfoWindow({
        map: map,
        position: location,
        content: contentFormat(data)
    });
    infowindow.open(map, marker);
}

// Sets the map on all markers in the array.
function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function serverPost(event){
    var url = "http://localhost:8080/lookup";

    event.preventDefault();
    var code = document.getElementById("code").value;

    var formData = {};
    formData.code = code;

    jQuery.ajax({
        type:"POST",
        url:url,
        data:JSON.stringify(formData),
        dataType:"json",
        contentType: "application/json"
    }).done(
        function(data){
            //localStorage.setItem("data", JSON.stringify(data));
            console.log(data);
            clearMarkers();
            for(var i = 0; i < data.length; i++){
                addMarker(data[i]);
            }
        }
    ).fail(
        function(data){
            console.log('err');
            console.log(JSON.stringify(data));
            console.log(data.status);
            console.log(data.statusMessage);
        }
    );
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);