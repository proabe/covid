document.addEventListener('DOMContentLoaded', function (){
    console.log('JS loaded!!');

    var map = L.map('mapid').setView([22.9179229, 79.5849609], 4); //intializing map

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXRzaGFyaXB1dHRhciIsImEiOiJjamh0YXlsMWcwYnc2M3ZxaDlvdW41a2R5In0.PP6-W_XWwW2_zMEEDMnLmQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
        /* maxZoom: 4, */
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiaXRzaGFyaXB1dHRhciIsImEiOiJjamh0YXlsMWcwYnc2M3ZxaDlvdW41a2R5In0.PP6-W_XWwW2_zMEEDMnLmQ'
    }).addTo(map); //adding tile layer to map

    fetch(`/covid/api/india/vrdls/geojson`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                alert(`Couldn't fetch data`);
            }
            var geojsonFeature = data;
            L.geoJSON(geojsonFeature, {onEachFeature: onEachFeature}).addTo(map);
        });
    });

    function onEachFeature(feature, layer) {
        if (feature.properties) {
            layer.bindPopup("<div class=\"popup\"><h6> Place: " +feature.properties.label + "</h6> "  + "<p>State/UT: " + feature.properties.state_ut + " </p>"+ '<a target="_blank" href="https://maps.google.com?q='+feature.geometry.coordinates[1]+','+feature.geometry.coordinates[0]+'">Google maps</a>');
        }
    };

    /* map.on('click', (e)=>{
        console.log(e);
    }) */

});