const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0).map(s => parseInt(s, 10));
	let result = lines.filter((e, i, a) => i < a.length - 1 && e < a[i + 1]).length;
	return result;
}

const testResult = exec(testPath);
if (testResult != 7) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));