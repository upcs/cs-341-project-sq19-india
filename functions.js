/*functions.js
  Author: Huy Nguyen
  Version: 2/12/2019
*/

/*
  function: buttonPressed
  check to see if coordinate inputs are correct
*/
function buttonPressed() {
	//Get the text object
	var firstBox = document.getElementById('x-coor');
	var secondBox = document.getElementById('y-coor');
	//Get the input of the text objects
	var firstInput = firstBox.value;
	var secondInput = secondBox.value;
	//Check to see if any of the box is empty, return false if it is
	if(firstInput == "" || secondInput == ""){
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
	if(!isNaN(firstInput) && !isNaN(secondInput)) {
		alert('coordinate inputs are correct.');
		return true;
	}
	else {
		alert('inputs are incorrect, can only be numbers.');
		return false;
	}
}
