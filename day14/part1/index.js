const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function exec(path, iterations) {
	const symbols = new Set();
	const counts = {};
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0);
	const chain = lines.splice(0, 1)[0].split('');
	chain.forEach(s => {
		symbols.add(s);
		counts[s] = (counts[s] || 0) + 1;
	});
	const reacts = lines.map(s => s.split(' -> '));
	reacts.forEach(e => {
		if (!counts[e[0][0]]) counts[e[0][0]] = 0;
		if (!counts[e[0][1]]) counts[e[0][1]] = 0;
		if (!counts[e[1]]) counts[e[1]] = 0;
		symbols.add(e[0][0]);
		symbols.add(e[0][1]);
		symbols.add(e[1]);
	});
	console.log(`Start: ${chain.join('')}`);

	for (let i = 0; i < iterations; i++) {
		const inserts = [];
		for (let idx = 0; idx < chain.length - 1; idx++) {
			for (const react of reacts) {
				if (chain[idx] == react[0][0] && chain[idx + 1] == react[0][1]) {
					inserts.push([ idx + 1, react[1] ]);
					break;
				}
			}
		}
		let offset = 0;
		for (const ins of inserts) {
			chain.splice(ins[0] + offset, 0, ins[1]);
			counts[ins[1]]++;
			offset++;
		}

		console.log(`After step ${i + 1}\n${chain.join('')}`);
	}

	const few = Math.min(...Object.values(counts));
	const many = Math.max(...Object.values(counts));
	return many - few;
}

const testResult = exec(testPath, 10);
if (testResult != 1588) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath, 10));
