const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function drag(x, amt=-1) {
	return Math.max(x + amt, 0);
}

function gravity(y, amt=-1) {
	return y + amt;
}

function inside(x, y, left, right, top, bottom) {
	return x >= left && x <= right && y >= bottom && y <= top;
}

function exec(path) {
	const matches = fs.readFileSync(path, { encoding: 'utf-8' }).matchAll(/(-?\d+)\.\.(-?\d+)/g);
	let [ , left, right ] = matches.next().value;
	left = parseInt(left);
	right = parseInt(right);
	let [ , bottom, top ] = matches.next().value;
	bottom = parseInt(bottom);
	top = parseInt(top);

	let count = 0;
	let overallHighY = -1e16;
	for (let startVelY = -1000; startVelY < 1000; startVelY++) {
		for (let startVelX = -1000; startVelX < 1000; startVelX++) {
			let x = 0;
			let y = 0;
			let dx = startVelX;
			let dy = startVelY;
			let curHighY = y;
			while (dy >= 0 || y >= bottom) {
				x += dx;
				y += dy;
				if (y > curHighY) {
					curHighY = y;
				}

				dx = drag(dx);
				dy = gravity(dy);

				if (inside(x, y, left, right, top, bottom)) {
					count++;
					if (curHighY > overallHighY) {
						overallHighY = curHighY;
					}
					break;
				}
			}
		}
	}

	return count;
}

const testResult = exec(testPath);
if (testResult != 112) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));
