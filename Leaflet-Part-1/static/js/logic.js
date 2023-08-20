// Store our API endpoint as url
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'


d3.json(url).then(function (data) {
    popFeatures(data.features);
});

function markerSize(magnitude) {
    return magnitude * 5;
}


function markerColor(magnitude) {
    if (magnitude <= -1) {
      return "#79ff4d";
    } else if (magnitude <= 2) {
      return "#d2ff4d";
    } else if (magnitude <= 3) {
      return "#ffff4d";
    } else if (magnitude <= 4) {
      return "#ffd24d";
    } else if (magnitude <= 5) {
      return "#ffa64d";
    } else if (magnitude <= 6) {
      return "#ff794d";
    } else {
      return "#ff4d4d";
    }
};

function popFeatures(earthquake) {

    
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude - ${feature.properties.mag} </p>`);
    }
  
    let earthquakes = L.geoJSON(earthquake, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                color: "#000",
                weight: 0.3,
                opacity: 1,
                fillOpacity: 1
            });
        },
        onEachFeature: onEachFeature
    });
  
    
    popMap(earthquakes);
  }
  
  function popMap(earthquakes) {
  
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let baseMaps = {
      "Street Map": street
    };
    
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });

  
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend");
      magnitudes = [1 , 2, 3, 4, 5, 6];
      labels = [];
      legendInfo = "<strong>Magnitude</strong>";
      div.innerHTML = legendInfo;
      
      
      for (var i = 0; i < magnitudes.length; i++) {
        var magnitudeRange = magnitudes[i];
        var nextMagnitude = magnitudes[i + 1];
        var color = markerColor((magnitudeRange + nextMagnitude) / 2);
        var label = '<li style="background-color:' + color + '"> <span>' + magnitudeRange + (nextMagnitude ? '&ndash;' + nextMagnitude : '+') + '</span></li>';
        
        labels.push(label);
      }
      
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
    
    legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  }