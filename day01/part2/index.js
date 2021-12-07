const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function exec(path, winSize) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0).map(s => parseInt(s, 10));
	let result = lines.filter((e, i, a) => i < a.length - winSize && sum(a, i, winSize) < sum(a, i + 1, winSize)).length;
	return result;
}

function sum(a, offset, length) {
	return a.slice(offset, offset + length).reduce((t, c) => t + c, 0);
}

const testResult = exec(testPath, 3);
if (testResult != 5) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath, 3));