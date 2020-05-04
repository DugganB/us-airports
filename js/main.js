var mymap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 4,
  maxZoom: 10,
  minZoom: 3,
  detectRetina: true,
});

L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png").addTo(
  mymap
);

var airports = null;

for (i = 0; i < 9; i++) {
  $("head").append(
    $(
      "<style> .marker-color-" +
        (i + 1).toString() +
        " { color: " +
        colors[i] +
        "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"
    )
  );
}

airports = L.geoJson
  .ajax("../assets/airports.geojson", {
    onEachFeature: function (feature, layer) {
      let popupContent = `
      <div>
        <h3>${feature.properties.AIRPT_NAME}</h3>
        <div>Airport Code: ${feature.properties.IATA}</div>
        <div>Elevation: ${feature.properties.ELEV} ft</div>
        <div>City: ${feature.properties.CITY}, ${feature.properties.STATE}</div>
        <div>Air Traffic Tower: ${
          feature.properties.CNTL_TWR === "Y" ? "Yes" : "No"
        }
      </div>`;
      c;
      layer.bindPopup(popupContent);
    },
    pointToLayer: function (feature, latlng) {
      let iconClass = "fa-plane-departure";
      if (feature.properties.CNTL_TWR === "Y") {
        iconClass = "fa-broadcast-tower";
      }
      return L.marker(latlng, {
        icon: L.divIcon({
          className: `fas ${iconClass}`,
        }),
      });
    },
    attribution:
      "Airport Data &copy; Data.gov | US States &copy; Mike Bostock of D3 | Base Map &copy; CartoDB | Made By Duggan Burke",
  })
  .addTo(mymap);

colors = chroma.scale(["fff", "#004643"]).colors(6);

function setColor(density) {
  var id = 0;
  if (density > 59) {
    id = 5;
  } else if (density > 19) {
    id = 4;
  } else if (density > 13) {
    id = 3;
  } else if (density > 10) {
    id = 2;
  } else if (density > 7) {
    id = 1;
  }
  return colors[id];
}

function style(feature) {
  return {
    fillColor: setColor(feature.properties.count),
    fillOpacity: 0.8,
    weight: 2,
    opacity: 1,
    color: "#b4b4b4",
    dashArray: "4",
  };
}

var states = null;
states = L.geoJson
  .ajax("../assets/us-states.geojson", {
    style: style,
  })
  .addTo(mymap);

var legend = L.control({ position: "topright" });

legend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<b># Airports</b><br />";
  div.innerHTML +=
    '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p>60+</p>';
  div.innerHTML +=
    '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>20-59</p>';
  div.innerHTML +=
    '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>14-19</p>';
  div.innerHTML +=
    '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>11-13</p>';
  div.innerHTML +=
    '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>8-10</p>';
  div.innerHTML +=
    '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-7</p>';
  div.innerHTML += "<hr><b>Airport Type<b><br />";
  div.innerHTML +=
    '<div class="pb-2"><i class="fas fa-plane-departure"></i><p> With Air Traffic Control</p></div>';
  div.innerHTML +=
    '<i class="fas fa-broadcast-tower"></i><p> No Air Traffic Control</p>';

  return div;
};

legend.addTo(mymap);

L.control.scale({ position: "bottomleft" }).addTo(mymap);
