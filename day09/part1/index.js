const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0);
	const cells = lines.map(line => line.split('').map(s => parseInt(s, 10)));

	let lowSum = 0;
	for (let y = 0; y < cells.length; y++) {
		for (let x = 0; x < cells[y].length; x++) {
			const me = cells[y][x];
			const low = (x == 0 					|| isLower(cells, me, x - 1, 	y)) 	&&
						(x >= cells[y].length - 1 	|| isLower(cells, me, x + 1, 	y)) 	&&
						(y == 0 					|| isLower(cells, me, x, 		y - 1)) &&
						(y >= cells.length - 1 		|| isLower(cells, me, x, 		y + 1));
			
			if (low) {
				lowSum += me + 1;
			}
		}
	}

	return lowSum;
}

function isLower(cells, me, x, y) {
	return me < cells[y][x];
}

const testResult = exec(testPath);
if (testResult != 15) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));
