//  Read in the eartquake data
let scale = 10000
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
d3.json(url).then(function (data) {

  let myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3

  });

  // Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  data.features.map((value, index) => {

    let geometry = value.geometry;
    // console.log("coordinates =" + JSON.stringify(geometry.coordinates));
    let coordinates = geometry.coordinates;
    let longitude = coordinates[0];
    let latitude = coordinates[1];
    let altitude = coordinates[2];
    let coord = {lat: latitude, lng: longitude};
    let magnitude = value.properties.mag;
    let location = value.properties.place;
    

    // console.log("longitude = " + longitude);
   
//  Get the depth color
    function calculateColor(altitude) {
      if (altitude > 90)
        return "#f25c64"
      else if (altitude > 70)
        return "#f9a25d"
      else if (altitude > 50)
        return "#fdb733"
      else if (altitude > 30)
        return "#f6db38"
      else if (altitude > 10)
        return "#daed39"
      else if (altitude >= -10)
        return "#9eea33"
    }


    // Add circles to the map.
    L.circle(coord, {
      opacity: 1,
      fillOpacity: 1,
      color: "black",
      fillColor: calculateColor(altitude),
      // Adjust the radius.
      radius: scale * magnitude,
      stroke: true,
      weight:0.5
    }).bindPopup("<b>Location: </b>" + location + "<br/><b>Magnitude:</b> " + magnitude).addTo(myMap);
   console.log(location, coord, magnitude) 

 });

 //   Create Legend for the map
 let legend = L.control({position: "bottomright"});
 legend.onAdd = function () {
   let div = L.DomUtil.create("div", "info legend");
   
   let grades =[-10, 10, 30, 50, 70, 90];
   let colors = ["#9eea33","#daed39", "#f6db38", "#fdb733","#f9a25d","#f25c64"];
  
   for (let i = 0; i < grades.length; i++) {
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};
//  Add legend to map
   legend.addTo(myMap);


  });