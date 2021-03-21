let link= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
console.log("data")

function markerSize(mag) {
    return mag* 30000;
}

function markerColor(mag) {
    if (mag <= 1) {
        return "#999999";
    } else if (mag <= 2) {
        return "#f781bf";
    } else if (mag <= 3) {
        return "#a65628";
    } else if (mag <= 4) {
        return "#ffff33";
    } else if (mag <= 5) {
        return "#1f78b4";
    } else if (mag <= 6) {
        return "#984ea3";
    } else if (mag <= 7) {
        return "#4daf4a";
    } else if (mag <= 8) {
        return "#377eb8";
    } else {
        return "#e41a1c";
    };

}

// Perform a GET request to the query URL
d3.json(link, function(data) {
    console.log(data)
    console.log(data.features)
    // console.log(data.properties)

// Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    let earthquakes = L.geoJSON(earthquakeData, {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
        return new L.circle(latlng,
            {radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.properties.mag),
            fillOpacity: 1,
            stroke: false,
        })
    }
});

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define satelitemap and darkmap layers
    let satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

    let darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
    });

  // Define a baseMaps object to hold our base layers
    let baseMaps = {
    "Satelite Map": satelitemap,
    "Dark Map": darkmap
    };

  // Create overlay object to hold our overlay layer
    let overlayMaps = {
    Earthquakes: earthquakes
    };

    // Create our map, giving it the satelitemap and earthquakes layers to display on load
    let myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 3,
        layers: [satelitemap, darkmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
    
        let div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5];
    
        for (let i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
        + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
        }
    
        return div;
    };
    
    legend.addTo(myMap);

    }