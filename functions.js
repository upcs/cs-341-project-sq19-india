/*functions.js
  Author: Huy Nguyen
  Version: 2/12/2019
*/

/*
  function: buttonPressed
  check to see if coordinate inputs are correct
*/
function buttonPressed(firstNum, secondNum) {
	//Check to see if any of the box is empty, return false if it is
	if(firstNum === "" || secondNum === ""){
		alert('one of the box is empty.');
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
		//check if number is in Portland's general area
		if(firstNum >= 45.434 && firstNum <= 45.615 && secondNum <= -122.484 && secondNum >= -122.719){	
			alert('coordinate inputs are correct.');
			return true;
		}
		else{
			alert('Please choose an area closer to Portland');
			return false;
		}
	}

	else{
		alert('inputs are incorrect, can only be numbers.');
		return false;
	}
}
module.exports = buttonPressed;