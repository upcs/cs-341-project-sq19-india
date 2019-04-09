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


$(document).ready(function() {

	//on SUBMIT button press
	$('#submitBtn').click(function() {

		//get entered data
		var firstNum = document.getElementById('x-coor').value;
		var secondNum = document.getElementById('y-coor').value;
		var radius = parseInt(document.getElementById('strength').value);
		var disasterType = document.getElementById('disasterType').value;

		//convert radius from meters to lat/long
		radius = radius/111000; ///~111000m per degree lat/long
		console.log("x-coor: " + firstNum);
		console.log("y-coor: " + secondNum);
		console.log("radius: " + radius);

		//check for correct input
		if(!checkCoor(firstNum, secondNum)) {
			throw 'Incorrect input';
		}

		//post request
		$.post("http://localhost:3000/data", {x_coor:firstNum, y_coor:secondNum, radius:radius, disaster:disasterType}, function(data) {
			$("#DataDisplay").show(); //display returned data
			data = JSON.parse(data);
			$("#TierOneData").text(data.tierOneCount);
			$("#PoliceData").text(data.policeCount);
			$("#MarketData").text(data.mktCount);
		});
	});

	//on slider change, update value display
	$('#strength').on('input', function(){
		radius=$(this).val();
		$('#radius_display').text(radius+"m");
	});


	$('#disasterType').on('change', function(){
		//alert($(this).val());
		if($(this).val() === 'Tornado'){
			$('.angleSlideContainer').show();
			//alert($('#angle').css());
		} else {
			$('.angleSlideContainer').hide();
		}
	});

});

module.exports = checkCoor;
