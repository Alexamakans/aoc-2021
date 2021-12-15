const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const octos = data.split(/\r?\n/).filter(s => s.length > 0).map((s, y) => s.split('').map((c, x) => {
		return {
			counter: parseInt(c, 10),
			x,
			y
		};
	}));
	const flatOctos = octos.flat();

	let numFlashes = 0;
	let step = 0;
	while (true) {
		step++;
		const haveFlashed = [];

		// Step 1, increment all
		flatOctos.forEach(octo => octo.counter++);

		// Step 2, flash all greater than 9
		let numFlashedThisStep = 0;
		while ((toFlash = flatOctos.filter(octo => !haveFlashed[octo.x + octo.y * 10] && octo.counter > 9)).length > 0) {
			toFlash.forEach(octo => {
				numFlashes++;
				numFlashedThisStep++;
				const { x, y } = octo;
				haveFlashed[octo.x + octo.y * 10] = true;
				for (let dx = -1; dx <= 1; dx++) {
					for (let dy = -1; dy <= 1; dy++) {
						if (dx === 0 && dy === 0) {
							continue;
						}

						if (x + dx < 0 || x + dx > 9 || y + dy < 0 || y + dy > 9) {
							// Index OOB
							continue;
						}
						octos[y + dy][x + dx].counter++;
					}
				}
			});
		}
		if (numFlashedThisStep === 100) {
			return step;
		}

		// Step 3, reset powers
		flatOctos.forEach(octo => {
			if (octo.counter > 9) {
				octo.counter = 0;
			}
		})
	}

	// return numFlashes;
}

const testResult = exec(testPath);
if (testResult != 195) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));
