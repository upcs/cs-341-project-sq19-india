const checkCoor = require('./functions.js');

test('is 45 and 68 numbers', () => {
	expect(checkCoor(45, 68)).toBe(true);
});

test('empty inputs', () => {
	expect(checkCoor("","")).toBe(false);
}); 

test('is abc and def numbers', () => {
	expect(checkCoor("adc", "def")).toBe(false);
});
