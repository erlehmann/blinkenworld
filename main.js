var map = new OpenLayers.Map(
    'map',
    {maxResolution: 0.703125}
);

var wmscURL = [
    "http://wmsc1.terrapages.net/getmap?",
    "http://wmsc2.terrapages.net/getmap?",
    "http://wmsc3.terrapages.net/getmap?",
    "http://wmsc4.terrapages.net/getmap?"
];
var terrapagesStreetLayer = new OpenLayers.Layer.WMS(
    'TerraPages Street',
    wmscURL,
    {
        layers: 'UnprojectedStreet',
        format: 'image/jpeg'
    },
    {
        buffer: 1,
        isBaseLayer: true
    }
);
map.addLayer(terrapagesStreetLayer);
map.zoomToMaxExtent();

document.addEventListener('DOMContentLoaded', function (){
    var markersLayer = new OpenLayers.Layer.Markers('Countryballs');

    var req = new XMLHttpRequest();  
    req.open('GET', 'http://krautchan.net/ajax/geoip/lasthour', true);  
    req.onreadystatechange = function(e) {
        if (req.readyState == 4) {  
            if(req.status == 200) {
                intData = JSON.parse(req.responseText)["data"];

                for (i in intData) {
                    var lon = intData[i][1];
                    var lat = intData[i][2];

                    // image size cannot be known before load
                    if (intData[i][0] == 'gb') {
                        var iconSize =  new OpenLayers.Size(19, 19);
                    } else if (intData[i][0] == 'id') {
                        var iconSize =  new OpenLayers.Size(17, 18);
                    } else if (intData[i][0] == 'il') {
                        var iconSize =  new OpenLayers.Size(18, 18);
                    } else if (intData[i][0] == 'kz') {
                        var iconSize =  new OpenLayers.Size(22, 14);
                    } else if (intData[i][0] == 'staff') {
                        var iconSize =  new OpenLayers.Size(25, 20);
                    } else {
                        var iconSize =  new OpenLayers.Size(17, 14);
                    }

                    var iconOffset = new OpenLayers.Pixel(-(iconSize.w/2), -iconSize.h);
                    var iconURL = 'http://krautchan.net' + intData[i][3];

                    var marker = new OpenLayers.Marker(
                        new OpenLayers.LonLat(lon, lat),
                        new OpenLayers.Icon(iconURL, iconSize, iconOffset)
                    );
            
                    markersLayer.addMarker(marker);
                };
                
                map.addLayer(markersLayer);
                markersLayer.setVisibility(true);
            } else {
                alert('Could not reach Krautchan /int/ API.');
            }
        }
    };
    req.send(null);

}, false);
