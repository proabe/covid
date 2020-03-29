document.addEventListener("DOMContentLoaded", function() {
  console.log("JS loaded!!");

  var map = L.map("mapid").setView([22.9179229, 79.5849609], 4); //intializing map

  var geojson;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);

  function createMap() {
    fetch(
      `/covid/api/india/covidData?sortBy=Total Cummulative Confirmed cases&geojson=true`
    )
      .then(response => {
        if (response.error) {
          throw new Error();
        }
        return response.json();
      })
      .then(jsonData => {
        if (jsonData.statusCode !== 200) {
          throw new Error();
        }
        return jsonData;
      })
      .then(jData => {
        let dmax =
          jData.data.features[0].properties[
            "Total Cummulative Confirmed cases"
          ];
        let dmin =
          jData.data.features[jData.data.features.length - 1].properties[
            "Total Cummulative Confirmed cases"
          ];
        createRange(dmax, dmin);
        createLegends(
          arr,
          arr.map(arrElem => {
            return getColor(arrElem);
          })
        );
        geojson = L.geoJson(jData.data, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(map);
      })
      .catch(e => {
        alert(e);
      });
  }

  const createHTML = data => {
    let html = `<p>
                  <b>${data["State/UT"]}</b><br>
                  Total Cummulative Confirmed cases:${data["Total Cummulative Confirmed cases"]}<br>
                  Cured/Discharged/Migrated:${data["Cured/Discharged/Migrated"]}<br>
                  Death:${data["Death"]}<br>
                </p>`;
    return html;
  };

  var arr = [];
  function createRange(max, min, steps = 10) {
    var range = parseInt(Math.ceil((max - min) / steps));
    for (var i = min; i < max; i = i + range) {
      arr.unshift(i);
    }
  }

  function getColor(d) {
    // console.log(arr);
    return d > arr[0]
      ? "#cb002f"
      : d > arr[1]
      ? "#d33b30"
      : d > arr[2]
      ? "#db5931"
      : d > arr[3]
      ? "#e27233"
      : d > arr[4]
      ? "#e88936"
      : d > arr[6]
      ? "#eea03b"
      : d > arr[7]
      ? "#f4b644"
      : d > arr[8]
      ? "#f8cb50"
      : d > arr[9]
      ? "#fff585"
      : "#ffffaa";
  }

  function style(feature) {
    return {
      fillColor: getColor(
        feature.properties["Total Cummulative Confirmed cases"]
      ),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 3,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
    info.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  var info = L.control();

  info.onAdd = function(map) {
    this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
    this.update();
    return this._div;
  };

  // method that we will use to update the control based on feature properties passed
  info.update = function(props) {
    this._div.innerHTML =
      "<h4>State Stats</h4>" +
      (props ? createHTML(props) : "Hover over a state");
  };

  function createLegends(grades, colorArr) {
    grades.reverse();
    colorArr.reverse();
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend"),
        labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          colorArr[i] +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }

      return div;
    };

    legend.addTo(map);
    grades.reverse();
    colorArr.reverse();
  }

  info.addTo(map);

  createMap();
});
