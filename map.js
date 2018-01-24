

var map;
var serviceAreaLayer;
function buildMap() {
  const mapSettings = {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>'
  };

  function constructTileURL(name) {
    return `https://api.tiles.mapbox.com/v4/mapbox.${ name }/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwc2FuZGFwcHMiLCJhIjoiY2pjYmNncHo2MHA2djJ3cW8ycWNzZHBwOSJ9.9c-NcWYyKKsbvtHF9tuQBA`;
  }

  map = L.map('map', {
    center: [33.7530, -84.3984],
    zoom: 11,
    dragging: false
  });
  var streets = L.tileLayer(constructTileURL('streets'), mapSettings).addTo(map);
  var satellite = L.tileLayer(constructTileURL('satellite'), mapSettings);
  var outdoors = L.tileLayer(constructTileURL('outdoors'), mapSettings);

  L.control.layers({
    "Streets": streets,
    "Satellite": satellite,
    "Outdoors": outdoors
  }).addTo(map);

  // serviceAreaLayer = L.polygon(serviceAreaPolygon, {
  //   color: 'red'
  // }).addTo(map);

  serviceAreaLayer = L.geoJSON(serviceAreaGeojson).addTo(map);
}

function locate() {
  console.log('locate');
  map.locate({
    watch: false,
    setView: true
  }).on('locationfound', onLocationFound);
  document.getElementById("find-location").innerHTML = 'Searching...';
}

var geolocationDot;
var geolocationAccuracy;
function onLocationFound(e) {
  console.log('location found');
  if (geolocationDot) {
    geolocationDot.removeFrom(map);
    geolocationAccuracy.removeFrom(map);
  }
  var radius = e.accuracy / 2;
  geolocationDot = L.circleMarker(e.latlng, {
    radius: 5,
    stroke: false,
    fillOpacity: 1.0
  }).addTo(map);
  geolocationAccuracy = L.circle(e.latlng, radius, {
    stroke: false
  }).addTo(map);

  if (leafletPip.pointInLayer(geolocationDot.getLatLng(), serviceAreaLayer).length > 0) {
    document.getElementById("location-text").innerHTML = 'You are in the service area.';
  } else {
    document.getElementById("location-text").innerHTML = 'You are outside the service area.';
  }
  document.getElementById("find-location").innerHTML = 'Find my location';
}

window.onload = () => {
  document.getElementById("find-location").addEventListener("click", locate);
  buildMap();
}
