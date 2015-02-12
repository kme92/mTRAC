var map;
$(document).ready(
    function(){initialize();}
);

function initialize() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(43.659972, -79.393102)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);