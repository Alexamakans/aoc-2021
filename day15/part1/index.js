const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function h(a, b) {
	return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function eq(a, b) {
	return a[0] == b[0] && a[1] == b[1];
}

function AStar(weights, start, goal) {
	const width = weights[0].length;
	const height = weights.length;
	const fScores = [];
	for (let x = 0; x < width; x++) {
		fScores[x] = [];
		for (let y = 0; y < height; y++) {
			fScores[x][y] = h([x, y], goal) * 10000;
		}
	}
	const gScores = [];
	for (let x = 0; x < width; x++) {
		gScores[x] = [];
		for (let y = 0; y < height; y++) {
			gScores[x][y] = 1000000000000;
		}
	}
	gScores[start[0]][start[1]] = 0;

	let openStack = []; // add, delete, get, has
	openStack.push(start);

	const cameFrom = new Map(); // set, delete, get, has

	const exists = [];
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			exists.push(conv(width, x, y));
		}
	}

	while (openStack.length > 0) {
		openStack.sort((a, b) => {
			if (fScores[a[0]][a[1]] == fScores[b[0]][b[1]]) {
				if (gScores[a[0]][a[1]] == gScores[b[0]][b[1]]) {
					if (a[0] == b[0]) {
						return a[1] - b[1];
					}
					return a[0] - b[0];
				}
				return gScores[a[0]][a[1]] - gScores[b[0]][b[1]];
			}
			return fScores[a[0]][a[1]] - fScores[b[0]][b[1]];
		});

		const cur = openStack.values().next().value;

		if (eq(cur, goal)) {
			const path = constructPath(width, cur, cameFrom);
			console.log(path.map(c => weights[c[1]][c[0]]));
			return path.reduce((t, c) => {
				return t + weights[c[1]][c[0]];
			}, 0) - weights[start[1]][start[0]];
		}

		openStack = openStack.filter(e => !eq(e, cur));

		const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];

		for (const offset of offsets) {
			const neighbor = [cur[0] + offset[0], cur[1] + offset[1]];
			const [x,y] = neighbor;

			if (x < 0 || x > width - 1) {
				continue;
			}

			if (y < 0 || y > height - 1) {
				continue;
			}

			const tmpGscore = gScores[cur[0]][cur[1]] + h(cur, neighbor) * weights[cur[1]][cur[0]];
			if (tmpGscore <= gScores[x][y]) {
				cameFrom.set(conv(width, x, y), cur);
				gScores[x][y] = tmpGscore;
				fScores[x][y] = tmpGscore + h(neighbor, goal);

				if (!openStack.find(c => eq(c, neighbor))) {
					openStack.push(neighbor);
				}
			}
		}
	}

	return false;
}

function conv(w, x, y) {
	return x + y * w;
}

function constructPath(width, cur, cameFrom) {
	const path = [];
	path.push(cur);

	while ((prev = cameFrom.get(conv(width, cur[0], cur[1])))) {
		cur = prev;
		path.push(cur);
	}

	return path;
}

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const weights = data.split(/\r?\n/).filter(s => s.length > 0).map(line => line.split('').filter(s => s.length).map(s => parseInt(s, 10)));
	
	const start = [0, 0];
	const goal = [weights[0].length - 1, weights.length - 1];

	return AStar(weights, start, goal);
}

let testResult = exec("../input_test_2.txt");
if (testResult != 6) {
	throw `Test 1 failed: ${testResult}, should be 6`;
}
testResult = exec(testPath);
if (testResult != 40) {
	throw `Test 2 failed: ${testResult}, should be 40`;
}

console.log(exec(realPath));

/*
let testResult = exec("../input_test_1.txt");
if (testResult != 6) {
	throw `Test 1 failed: ${testResult}, should be 6`;
}

testResult = exec(testPath);
if (testResult != 40) {
	throw `Test 2 failed: ${testResult}, should be 40`;
}

console.log(exec(realPath));
*/