var MapWrapper = function(container, coords, zoom){
  var container = document.getElementById('main-map');
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: 5
  });
  this.markers = [];
}

MapWrapper.prototype.recenterMap = function(newCenter){
  this.googleMap.setCenter({lat: newCenter[0], lng: newCenter[1]});
}

var currentInfoWindow;
var currentMarker;

MapWrapper.prototype.markerAtCurrentCountry = function(){
  var jsonString = localStorage.getItem('currentCountry');
  var country = JSON.parse(jsonString);
  if (currentMarker != null){
    currentMarker.setMap(null);
  }
  var marker = new google.maps.Marker({
    position: {lat: country.latlng[0], lng: country.latlng[1]},
    map: this.googleMap
  });
  currentMarker = marker;
  var infowindow = new google.maps.InfoWindow({
    content: country.name
  });
  marker.addListener('click', function(){
    infowindow.open(marker.map, marker);
    if (currentInfoWindow != null) { currentInfoWindow.close(); }
    currentInfoWindow = infowindow;
  });


}
