const isNum = require('./functions.js');

test('is 45 and 68 numbers', () => {
	expect(isNum(45, 68)).toBe(true);
});

test('empty inputs', () => {
	expect(isNum( , )).toBe(false);
});

test('is abc and def numbers', () => {
	expect(isNum(adc, def)).toBe(false);
});