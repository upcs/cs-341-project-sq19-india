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
	if(firstNum == "" || secondNum == ""){
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
		alert('coordinate inputs are correct.');
		return true;
	}
	else {
		alert('inputs are incorrect, can only be numbers.');
		return false;
	}
}
module.exports = buttonPressed;