const fs = require('fs');
const { wrap } = require('module');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function pr(wo, w, h, l, vert) {
	s = '';
	for (let y = 0; y < h; y++) {
		
		if (!vert && y === l) {
			s += '-'.repeat(w) + '\n';
		} else {
			for (let x = 0; x < w; x++) {
				if (vert && x === l) {
					s += '|';
				} else {
					s += wo[x][y] ? '#' : ' ';
				}
			}
			s += '\n';
		}
	}
	console.log(s);
}

function exec(path, folds) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	let dots = data.split(/\r?\n\r?\n/)[0].split(/\r?\n/).filter(s => s.length > 0).map(e => e.split(',').map(s => parseInt(s, 10)));
	const commands = data.split(/\r?\n\r?\n/)[1].split(/\r?\n/).filter(s => s.length > 0).map(s => {
		return {
			vertical: s.match("along x=") ? true : false,
			val: parseInt(s.match(/(\d+)/)[1], 10),
		};
	});
	if (folds === 'ALL') {
		folds = commands.length;
	}
	// console.log(folds);
	let width = Math.max(...dots.map(x => x[0])) + 1;
	let height = Math.max(...dots.map(x => x[1])) + 1;
	let world = [];
	for (let x = 0; x < width; x++) {
		world[x] = [];
		for (let y = 0; y < height; y++) {
			world[x][y] = false;
		}
	}
	for (const dot of dots) {
		world[dot[0]][dot[1]] = true;
	}
	for (let fold = 0; fold < folds; fold++) {
		const { val, vertical } = commands[fold];
		console.log("before");
		pr(world, width, height, val, vertical);
		const v = val;
		if (vertical) {
			for (let x = 0; x < width; x++) {
				for (let y = 0; y < height; y++) {
					const isDot = world[x][y];
					if (isDot && x > val) {
						const VX = 2 * v - x;
						if (VX < 0) continue;
						// world[x][y] = false;
						world[VX][y] = isDot || world[VX][y];
					}
				}
			}
		} else {
			for (let x = 0; x < width; x++) {
				for (let y = 0; y < height; y++) {
					const isDot = world[x][y];
					if (isDot && y > val) {
						const VY = 2 * v - y;
						if (VY < 0) continue;
						// world[x][y] = false;
						world[x][VY] = isDot || world[x][VY];
					}
				}
			}
		}
		if (vertical) {
			width = val + 1;
		} else {
			height = val + 1;
		}
		console.log("after");

		for (const dot of dots) {
			world[dot[0]][dot[1]] = true;
		}
		pr(world, width, height, val, vertical);
	}
	let countDots = 0;
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			if (world[x][y]) {
				countDots++;
			}
		}
	}
	return countDots;
}

const testResult = exec(testPath, 1);
if (testResult != 17) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath, 'ALL'));