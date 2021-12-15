const fs = require('fs');
const { wrap } = require('module');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function pr(wo, w, h, l, vert) {
	console.log(l);
	s = '';
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			s += wo[x][y] ? '#' : '.';
			if (vert && x + 1 === l) {
				s += '|';
			}
		}
		s += '\n';
		if (!vert && y + 1 === l) {
			s += '-'.repeat(w) + '\n';
		}
	}
	console.log(s);
}

function exec(path, folds) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	let dots = data.split(/\r?\n\r?\n/)[0].split(/\r?\n/).filter(s => s.length > 0).map(e => e.split(',').map(s => parseInt(s, 10)));
	const commands = data.split(/\r?\n\r?\n/)[1].split(/\r?\n/).filter(s => s.length > 0).map(s => {
		console.log(s);
		return {
			vertical: s.match("along x=") ? true : false,
			val: parseInt(s.match(/(\d+)/)[1], 10),
		};
	});
	console.log(commands);
	let width = Math.max(...dots.map(x => x[0])) + 1;
	let height = Math.max(...dots.map(x => x[1])) + 1;
	console.log(width, height);
	let world = [];
	for (let x = 0; x < width; x++) {
		world[x] = [];
		for (let y = 0; y < height; y++) {
			world[x][y] = dots.find(dot => dot[0] === x && dot[1] === y) ? true : false;
		}
	}
	for (let fold = 0; fold < folds; fold++) {
		const { val, vertical } = commands[fold];
		pr(world, width, height, val, vertical);
		const v = val;
		const cpDots = dots.slice();
		if (vertical) {
			for (const dot of cpDots) {
				const [x, y] = dot;
				if (x >= val) {
					const VX = 2 * v - x;
					world[x][y] = false;
					world[VX][y] = true;
					dots = cpDots.filter(d => d[0] !== x && d[1] !== y);
					if (!dots.find(d => d[0] === VX && d[1] === y)) {
						dots.push([VX, y]);
						if (VX >= 0) {
							dots.push([VX, y]);
						}
					}
				}
			}
		} else {
			for (const dot of cpDots) {
				const [x, y] = dot;
				if (y >= val) {
					const VY = 2 * v - y;
					world[x][y] = false;
					world[x][VY] = true;
					dots = cpDots.filter(d => d[0] !== x && d[1] !== y);
					if (!dots.find(d => d[0] === x && d[1] === VY)) {
						if (VY >= 0) {
							dots.push([x, VY]);
						}
					}
				}
			}
		}
		if (vertical) {
			width = val;
		} else {
			height = val;
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

console.log(exec(realPath, 1));
