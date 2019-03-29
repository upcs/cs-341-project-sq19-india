/*functions.js
  Author: Huy Nguyen
  Version: 2/12/2019
*/

/*
  function: buttonPressed
  check to see if coordinate inputs are correct
*/
function checkCoor(firstNum, secondNum) {
	//Check to see if any of the box is empty, return false if it is
	if(firstNum === "" || secondNum === ""){
		//alert('one of the box is empty.');
		return  false;
	}
	/*
	External Citation
	Problem: don't know how to check if input is a number
	Solution: look up example code online
	Source: https://stackoverflow.com/questions/18042133/check-if-input-is-number-or-letter-javascript
	Date: 2/12/2019
	*/
	//Check the coordinate inputs are number
	if(!isNaN(firstNum) && !isNaN(secondNum)) {
		//alert('coordinate inputs are correct.');
		return true;
	}
	else {
		alert('inputs are incorrect, can only be numbers.');
		return false;
	}
}

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
}


$(document).ready(function() {

	//on SUBMIT button press
	$('#submitBtn').click(function() {

		//get entered data
		var firstNum = document.getElementById('x-coor').value;
		var secondNum = document.getElementById('y-coor').value;
		var radius = parseInt(document.getElementById('strength').value);

		//convert radius from meters to lat/long
		radius = radius/111000;
		console.log("x-coor: " + firstNum);
		console.log("y-coor: " + secondNum);
		console.log("radius: " + radius);

		//check for correct input
		if(!checkCoor(firstNum, secondNum)) {
			throw 'Incorrect input';
		}

		//post request
		$.post("http://localhost:3000/data", {x_coor:firstNum, y_coor:secondNum, radius:radius}, function(data) {
			$("#DataDisplay").show(); //display returned data
			$("#TierOneData").text(data);
		});
	});

	//on slider change, update value display
	$('#strength').on('input', function(){
		radius=$(this).val();
		$('#radius_display').text(radius+"m");
	});

	$('#disasterType').on('input', function(){
		if($(this).val() === 'Tornado'){
			$('#angle').show();
		}
	});

});
module.exports = checkCoor;