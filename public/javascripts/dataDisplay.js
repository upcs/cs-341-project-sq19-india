$(document).ready(function() {

	//on SUBMIT button press
	$('#submitBtn').click(function() {

		//get entered data
		var firstNum = parseFloat(document.getElementById('x-coor').textContent);
		var secondNum = parseFloat(document.getElementById('y-coor').textContent);
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
		$.post("/data", {x_coor:firstNum, y_coor:secondNum, radius:radius}, function(data) {
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

	$('#disasterType').on('input', function(){
		if($(this).val() === 'Tornado'){
			$('#angle').show();
		}
	});
});
