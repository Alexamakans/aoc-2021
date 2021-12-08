const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function exec(path) {
	const uniques = { 2: '1', 4: '4', 3: '7', 7: '8' };

	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0);
	const outputs = lines.map(s => s.split('|')[1].replace(/^\s+/, '').replace(/\s+$/, '').split(' '));
	let cnt = 0;
	for (const outLine of outputs) {
		for (const output of outLine) {
			console.log(output, Object.keys(uniques), output.length);
			if (Object.keys(uniques).includes(""+output.length)) {
				cnt++;
			}
		}
	}
	return cnt;
}

const testResult = exec(testPath);
if (testResult != 26) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));
