//set up google map
function initMap() {
  // The location of map
  var local = { lat: 45.572237, lng: -122.723679 };
  // The map, centered at local
  var map = new google.maps.Map(
    document.getElementById('map'), { zoom: 10, center: local });
  // The marker, positioned at local
  var marker = new google.maps.Marker({ position: local, map: map });
  var slider = document.getElementById('strength');
  var angleSlider = document.getElementById('angle');
  var currAngle = 0;
	
	
	// Circle indicating damage radius (in meters)
  var circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: null,
      center: local,
      radius: parseFloat(document.getElementById('strength').value)
    });

  var rectangle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    bounds: {
      north: marker.getPosition().lat() + 0.03,
      south: marker.getPosition().lat() - 0.03,
      east: marker.getPosition().lng() + 0.6,
      west: marker.getPosition().lng() - 0.6
    }
  });

  var rectanglePoly = createPolygonFromRectangle(rectangle);

  //function to convert rectangle into polygon (needed in order to rotate)
  //from https://stackoverflow.com/questions/26049552/google-maps-api-rotate-rectangle
  function createPolygonFromRectangle(rectangle) {
    var map = rectangle.getMap();
  
    var coords = [
      { lat: rectangle.getBounds().getNorthEast().lat(), lng: rectangle.getBounds().getNorthEast().lng() },
      { lat: rectangle.getBounds().getNorthEast().lat(), lng: rectangle.getBounds().getSouthWest().lng() },
      { lat: rectangle.getBounds().getSouthWest().lat(), lng: rectangle.getBounds().getSouthWest().lng() },
      { lat: rectangle.getBounds().getSouthWest().lat(), lng: rectangle.getBounds().getNorthEast().lng() }
    ];

    // Construct the polygon.
    var rectPoly = new google.maps.Polygon({
        path: coords
    });
    var properties = ["strokeColor","strokeOpacity","strokeWeight","fillOpacity","fillColor"];
    //inherit rectangle properties 
    var options = {};
    properties.forEach(function(property) {
        if (rectangle.hasOwnProperty(property)) {
            options[property] = rectangle[property];
        }
    });
    rectPoly.setOptions(options);

    rectangle.setMap(null);
    rectPoly.setMap(map);
    console.log('made rect poly');
    return rectPoly;
}
    
	
	// on slider input, update circle radius
	google.maps.event.addDomListener(slider, 'input', function(){
		circle.setRadius(parseFloat(slider.value));
  });
  
  google.maps.event.addDomListener(angleSlider, 'input', function(){
    var angle = angleSlider.value - currAngle;
    console.log(currAngle);
    var pivotPoint = map.getProjection().fromLatLngToPoint(marker.getPosition());
    rotatePolygon(rectanglePoly, angle, pivotPoint);
    currAngle = angleSlider.value;
  });

  //this also (mostly) from https://stackoverflow.com/questions/26049552/google-maps-api-rotate-rectangle
  function rotatePolygon(polygon,angle, origin) {
    var map = polygon.getMap();
    var prj = map.getProjection();
    console.log(origin);
    console.log(polygon.getPath().getAt(0))
    var coords = polygon.getPath().getArray().map(function(latLng){
       var point = prj.fromLatLngToPoint(latLng);
       var rotatedLatLng =  prj.fromPointToLatLng(rotatePoint(point,origin,angle));
       return {lat: rotatedLatLng.lat(), lng: rotatedLatLng.lng()};
    });
    polygon.setPath(coords);
}
//this too from https://stackoverflow.com/questions/26049552/google-maps-api-rotate-rectangle
function rotatePoint(point, origin, angle) {
    var angleRad = angle;
    return {
        x: Math.cos(angleRad) * (point.x - origin.x) - Math.sin(angleRad) * (point.y - origin.y) + origin.x,
        y: Math.sin(angleRad) * (point.x - origin.x) + Math.cos(angleRad) * (point.y - origin.y) + origin.y
    };
}

	//change marker/circle position with text entry (x)
	google.maps.event.addDomListener(document.getElementById('x-coor'), 'input', function(){
		var newPos = new google.maps.LatLng(parseFloat($('#y-coor').val()), parseFloat($('#x-coor').val()));
		marker.setPosition(newPos);
		circle.setCenter(newPos);
	});

	//change marker/circle position with text entry (y)
	google.maps.event.addDomListener(document.getElementById('y-coor'), 'input', function(){
		var newPos = new google.maps.LatLng(parseFloat($('#y-coor').val()), parseFloat($('#x-coor').val()));
		marker.setPosition(newPos);
		circle.setCenter(newPos);
  });
  
  //change shape of damage area based on drop-down select
  google.maps.event.addDomListener(document.getElementById('disasterType'), 'input', function(){
    if($('#disasterType').val() === 'Tornado'){
      rectangle.setMap(map);
      circle.setMap(null);
    } else if ($('#disasterType').val() === 'Earthquake'){
      rectangle.setMap(null);
      circle.setMap(map);
    }
  });

	//update marker/circle position and text entries on map click
  google.maps.event.addListener(map, 'click', function(event){
    var long = event.latLng.lng();
    var lat = event.latLng.lat();
    $('#x-coor').val(long);
    $('#y-coor').val(lat);
    var prevPos = marker.getPosition();
    marker.setPosition(event.latLng);
    circle.setCenter(event.latLng);
    translatePolygon(rectanglePoly, event.latLng, prevPos);
  });
  
  function translatePolygon(shape, newCenter, currentCenter){
    var lngOffset = newCenter.lng() - currentCenter.lng();
    var latOffset = newCenter.lat() - currentCenter.lat();
    console.log(shape.getPaths());
    for(var i = 0; i < shape.getPaths().getLength(); i++){
      shape.getPaths().getAt(i).lat() += latOffset;
      shape.getPaths().getAt(i).lng() += lngOffset;
    }

  }
	
	google.maps.event.addListener(circle, 'click', function(event){
		var long = event.latLng.lng();
    var lat = event.latLng.lat();
    $('#x-coor').val(long);
    $('#y-coor').val(lat);
    marker.setPosition(event.latLng);
    circle.setCenter(event.latLng);
	});

	//update placeholder text if no click on map yet
  map.addListener('mousemove', function(event){
    $('#x-coor').attr('placeholder',''+event.latLng.lng());
    $('#y-coor').attr('placeholder',''+event.latLng.lat());
  });
  return true;
}

module.exports = initMap;