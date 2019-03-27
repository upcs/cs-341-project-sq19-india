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
	
	
	// Circle indicating damage radius (in meters)
  var circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: local,
      radius: parseFloat(document.getElementById('strength').value)
		});
	
	// on slider input, update circle radius
	google.maps.event.addDomListener(slider, 'input', function(){
		circle.setRadius(parseFloat(slider.value));
	});

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

	//update marker/circle position and text entries on map click
  google.maps.event.addListener(map, 'click', function(event){
    var long = event.latLng.lng();
    var lat = event.latLng.lat();
    $('#x-coor').val(long);
    $('#y-coor').val(lat);
    marker.setPosition(event.latLng);
    circle.setCenter(event.latLng);
	});
	
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