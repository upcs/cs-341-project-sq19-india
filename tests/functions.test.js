const checkCoor = require('../public/javascripts/functions.js');

test('is 45 and 68 numbers', () => {
	expect(checkCoor(45, 68)).toBe(true);
});

test('empty inputs', () => {
	expect(checkCoor("","")).toBe(false);
}); 

test('is abc and def numbers', () => {
	expect(checkCoor("adc", "def")).toBe(false);
});

/*test('close to Portland', () => {
	expect(checkInArea(-122.66, 45.5, .045 )).toBe(true);
});

test('not close to Portland', () =>{
	expect(checkInArea(-122.9, 45.5, .045)).toBe(false);
});*/
