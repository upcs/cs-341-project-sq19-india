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
			var parsedData = JSON.parse(data);
			alert("police count: "+parsedData.policeCount+",market count: "+parsedData.mktCount+",tier one count: "+parsedData.tierOneCount); //display returned data
		});
	});

	//on slider change, update value display
	$('#strength').on('input', function(){
		radius=$(this).val();
		$('#radius_display').text(radius+"m");
	});

});