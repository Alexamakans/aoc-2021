const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

let counts = {};
function addPair(pairs, a, b, v = 1) {
	if (!pairs[a+b]) pairs[a+b] = 0;
	if (!counts[a]) counts[a] = 0;
	if (!counts[b]) counts[b] = 0;
	pairs[a+b] += v;
}

function remPair(pairs, a, b, v = 1) {
	if (!pairs[a+b]) pairs[a+b] = 0;
	if (!counts[a]) counts[a] = 0;
	if (!counts[b]) counts[b] = 0;
	pairs[a+b] -= v;
}

function exec(path, iterations) {
	counts = {};
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0);
	const chain = lines.splice(0, 1)[0].split('');
	chain.forEach(s => {
		counts[s] = (counts[s] || 0) + 1;
	});
	const reacts = lines.map(s => s.split(' -> '));
	reacts.forEach(e => {
		if (!counts[e[0][0]]) counts[e[0][0]] = 0;
		if (!counts[e[0][1]]) counts[e[0][1]] = 0;
		if (!counts[e[1]]) counts[e[1]] = 0;
	});
	console.log(reacts);
	console.log(`Start: ${chain.join('')}`);

	let pairs = {};
	for (let i = 0; i < chain.length - 1; i++) {
		addPair(pairs, chain[i], chain[i + 1]);
	}
	for (let i = 0; i < iterations; i++) {
		let cp = {};
		for (const [k, v] of Object.entries(pairs)) cp[k] = v;
		
		for (const [k, v] of Object.entries(pairs)) {
			const react = reacts.find(r => r[0] == k);
			if (react) {
				remPair(cp, k[0], k[1], v);
				addPair(cp, k[0], react[1], v);
				addPair(cp, react[1], k[1], v);
				counts[react[1]] += v;
			}
		}
		console.log(cp);
		pairs = cp;
	}

	const few = Math.min(...Object.values(counts));
	const many = Math.max(...Object.values(counts));
	console.log(`${many} - ${few} = ${many - few}`);
	return many - few;
}

let testResult = exec(testPath, 10);
if (testResult != 1588) {
	throw `First test failed: ${testResult}`;
}

testResult = exec(testPath, 40);
if (testResult != 2188189693529) {
	throw `Second test failed: ${testResult}`;
}

let realResult = exec(realPath, 10);
if (realResult != 3009) {
	throw `First real failed: ${realResult}`;
}

realResult = exec(realPath, 40);
console.log(realResult);
// if (realResult != 3009) {
// 	throw `Real failed: ${realResult}`;
// }
