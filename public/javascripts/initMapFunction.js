
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

  var floodCoords = [
    {lat: 45.92,lng: -122.81 },
    {lat: 45.86 ,lng: -122.79},
    {lat: 45.79,lng: -122.78},
    {lat: 45.72,lng: -122.76},
    {lat: 45.65,lng: -122.75},
    {lat: 45.61,lng: -122.67},
    {lat: 45.60,lng: -122.58},
    {lat: 45.57,lng: -122.49},
    {lat: 45.56,lng: -122.39},
    {lat: 45.54,lng: -122.29},
    {lat: 45.56,lng: -122.19},
    {lat: 45.59,lng: -122.77},
    {lat: 45.55,lng: -122.70},
    {lat: 45.51,lng: -122.67},
    {lat: 45.45,lng: -122.65},
    {lat: 45.39,lng: -122.64},
    {lat: 45.34,lng: -122.62},
  ];

  var floodCircles = [];
  for(var i = 0; i < floodCoords.length; i++){
    floodCircles[i] = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: null,
      center: floodCoords[i],
      radius: parseFloat(document.getElementById('strength').value)
    })
  }

  function displayFlood(toggle){
    console.log('toggling flood display: '+toggle);
    if(toggle){
      for(var i = 0; i < floodCircles.length; i++){
        floodCircles[i].setMap(map);
        marker.setMap(null)
      }
    } else {
      for(var i = 0; i < floodCircles.length; i++){
        floodCircles[i].setMap(null);
        marker.setMap(map);
      }
    }
  }

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
    //console.log('made rect poly');
    return rectPoly;
}


	// on slider input, update circle radius
	google.maps.event.addDomListener(slider, 'input', function(){
    var rad = parseFloat(slider.value);
    circle.setRadius(rad);
    for(var i = 0; i < floodCircles.length; i++){
      floodCircles[i].setRadius(rad);
    }
  });


  google.maps.event.addDomListener(angleSlider, 'input', function(){
    var angle = angleSlider.value - currAngle;
    //console.log(currAngle);
    var pivotPoint = map.getProjection().fromLatLngToPoint(marker.getPosition());
    rotatePolygon(rectanglePoly, angle, pivotPoint);
    currAngle = angleSlider.value;
  });

  //change shape of damage area based on drop-down select
  google.maps.event.addDomListener(document.getElementById('disasterType'), 'input', function(){
    if($('#disasterType').val() === 'Tornado'){
      rectanglePoly.setMap(map);
      circle.setMap(null);
      displayFlood(false);
    } else if ($('#disasterType').val() === 'Earthquake'){
      rectanglePoly.setMap(null);
      circle.setMap(map);
      displayFlood(false);
    } else if ($('#disasterType').val() === 'Flood'){
      rectanglePoly.setMap(null);
      circle.setMap(null);
      displayFlood(true);
    }
  });

  //this also (mostly) from https://stackoverflow.com/questions/26049552/google-maps-api-rotate-rectangle
  function rotatePolygon(polygon, angle, origin) {
    var map = polygon.getMap();
    var prj = map.getProjection();
    //console.log(origin);
    //console.log(polygon.getPath().getAt(0))
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
    if(checkCoor($('#y-coor').val(), $('#x-coor').val())){
      var newPos = new google.maps.LatLng(parseFloat($('#y-coor').val()), parseFloat($('#x-coor').val()));
      moveAllShapes(newPos);
    }
	});

	//change marker/circle position with text entry (y)
	google.maps.event.addDomListener(document.getElementById('y-coor'), 'input', function(){
    var newPos = new google.maps.LatLng(parseFloat($('#y-coor').val()), parseFloat($('#x-coor').val()));
    var prevPos = marker.getPosition();
		marker.setPosition(newPos);
    circle.setCenter(newPos);
    translatePolygon(rectanglePoly, newPos, prevPos);
  });

  //change shape of damage area based on drop-down select
  google.maps.event.addDomListener(document.getElementById('disasterType'), 'input', function(){
    if($('#disasterType').val() === 'Tornado'){
      rectanglePoly.setMap(map);
      circle.setMap(null);
    } else if ($('#disasterType').val() === 'Earthquake'){
      rectanglePoly.setMap(null);
      circle.setMap(map);
  	}
    
    if(checkCoor($('#y-coor').val(), $('#x-coor').val())){
      var newPos = new google.maps.LatLng(parseFloat($('#y-coor').val()), parseFloat($('#x-coor').val()));
      moveAllShapes(newPos);
    }
  });

	//update marker/circle position and text entries on map click
  google.maps.event.addListener(map, 'click', function(event){
    $('#x-coor').val(event.latLng.lng());
    $('#y-coor').val(event.latLng.lat());
    moveAllShapes(event.latLng);
  });

  //for when we click on the circle (doesn't register as a click on the map)
	google.maps.event.addListener(circle, 'click', function(event){
    //update text in input fields
    $('#x-coor').text(event.latLng.lng());
    $('#y-coor').text(event.latLng.lat());
    moveAllShapes(event.latLng);
  });
  
  //for when we click on the rectangle (doesn't register as a click on the map)
	google.maps.event.addListener(rectanglePoly, 'click', function(event){
    //update text in input fields
    $('#x-coor').text(event.latLng.lng());
    $('#y-coor').text(event.latLng.lat());
    moveAllShapes(event.latLng);
  });

	//update placeholder text if no click on map yet
  map.addListener('mousemove', function(event){
    $('#x-coor').attr('placeholder',''+event.latLng.lng());
    $('#y-coor').attr('placeholder',''+event.latLng.lat());
  });



  //moves polygons to specified position
  function moveAllShapes(position){
    var prevPos = marker.getPosition();
    marker.setPosition(position);
    circle.setCenter(position);
    translatePolygon(rectanglePoly, position, prevPos);
  }

  //function to translate a polygon from currentCenter to newCenter
  function translatePolygon(shape, newCenter, currentCenter){

    //create difference vector
    var diff = new google.maps.LatLng({
      lat: newCenter.lat() - currentCenter.lat(),
      lng: newCenter.lng() - currentCenter.lng()
    });

    //map the translation to the paths of our shape
    var coords = shape.getPath().getArray().map(function(latLng){
      return {lat: latLng.lat()+diff.lat(), lng: latLng.lng()+diff.lng()};
    });

    //set the shape's new coordinates
    shape.setPath(coords);
  }

}

module.exports = initMap;
