const { constants } = require('buffer');
const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function zip(a, b) {
	return [[a[0], b[0]], [a[1], b[1]]];
}

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const pairs = data.split(/\r?\n/).filter(s => s.length > 0).map(s => s.split('-'));

	const conns = {};
	for (const pair of pairs) {
		const rev = [pair[1], pair[0]];
		for (const [p1, p2] of zip(pair, rev)) {
			if (p2 != 'start') {
				if (!conns[p1]) {
					conns[p1] = [];
				}
				conns[p1].push(p2);
			}
		}
	}
	delete conns['end'];

	function rec(data, path=['start']) {
		let res = 0;
		for (const p of data[path[path.length - 1]]) {
			if (p.toUpperCase() === p || !path.includes(p)) {
				if (p == 'end') {
					res++;
				} else {
					res += rec(data, [...path, p]);
				}
			}
		}
		return res;
	}
	return rec(conns);
}

const testResult = exec(testPath);
if (testResult != 10) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));
