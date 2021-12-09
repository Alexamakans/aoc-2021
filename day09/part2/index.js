const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0);
	const cells = lines.map(line => line.split('').map(s => parseInt(s, 10)));

	let lowests = [];
	for (let y = 0; y < cells.length; y++) {
		for (let x = 0; x < cells[y].length; x++) {
			const me = cells[y][x];
			const low = (x == 0 					|| isLower(cells, me, x - 1, 	y)) 	&&
						(x >= cells[y].length - 1 	|| isLower(cells, me, x + 1, 	y)) 	&&
						(y == 0 					|| isLower(cells, me, x, 		y - 1)) &&
						(y >= cells.length - 1 		|| isLower(cells, me, x, 		y + 1));

			if (low) {
				lowests.push([x, y]);
			}
		}
	}

	const basins = [];
	for (const lowest of lowests) {
		const [x, y] = lowest;
		basins.push(getBasinSize(cells, x, y));
	}

	basins.sort((a, b) => b - a);
	threeBiggest = basins.splice(0, 3);

	return threeBiggest.reduce((t, c) => t * c, 1);
}

// Only use with confirmed lowest point as startX, startY!
function getBasinSize(cells, startX, startY) {
	let size = 1;
	let list = [[startX, startY]];

	const checked = [conv(cells, startX, startY)];

	while (list.length > 0) {
		const [x, y] = list.pop();
		const me = cells[y][x];
		if (x > 0 && !checked.includes(conv(cells, x - 1, y)) && canFlowFrom(cells, me, x - 1, y)) {
			list.push([x - 1, y]);
			checked.push(conv(cells, x - 1, y));
			size++;
		}
		if (x < cells[y].length - 1 && !checked.includes(conv(cells, x + 1, y)) &&  canFlowFrom(cells, me, x + 1, y)) {
			list.push([x + 1, y]);
			checked.push(conv(cells, x + 1, y));
			size++;
		}
		if (y > 0 && !checked.includes(conv(cells, x, y - 1)) && canFlowFrom(cells, me, x, y - 1)) {
			list.push([x, y - 1]);
			checked.push(conv(cells, x, y - 1));
			size++;
		}
		if (y < cells.length - 1 && !checked.includes(conv(cells, x, y + 1)) && canFlowFrom(cells, me, x, y + 1)) {
			list.push([x, y + 1]);
			checked.push(conv(cells, x, y + 1));
			size++;
		}
	}

	return size;
}

function conv(cells, x, y) {
	return x + y * cells[0].length;
}

function canFlowFrom(cells, me, x, y) {
	return cells[y][x] !== 9 && me < cells[y][x];
}

function isLower(cells, me, x, y) {
	return me < cells[y][x];
}

const testResult = exec(testPath);
if (testResult != 1134) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));
