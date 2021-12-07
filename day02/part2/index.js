const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0);
	const cmds = lines.map(line => line.split(' '));
	const dirs = cmds.map(cmd => cmd[0]);
	const delta = cmds.map(cmd => parseInt(cmd[1], 10));
	
	let aim = 0;
	let horizontal = 0;
	let depth = 0;

	for (let i = 0; i < dirs.length; i++) {
		switch (dirs[i]) {
			case 'forward':
				horizontal += delta[i];
				depth += delta[i] * aim;
				break;
			case 'up':
				aim -= delta[i];
				break;
			case 'down':
				aim += delta[i];
				break;
		}
	}

	return horizontal * depth;
}

const testResult = exec(testPath);
if (testResult != 900) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));
