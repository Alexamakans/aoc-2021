/**
 * Version that was cleaned up a bit after submitting my answer in index.js.
 */

const { match } = require('assert');
const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

const patterns = [
    [0, 1, 2, 4, 5, 6],
    [2, 5],
    [0, 2, 3, 4, 6],
    [0, 2, 3, 5, 6],
    [1, 2, 3, 5],
    [0, 1, 3, 5, 6],
    [0, 1, 3, 4, 5, 6],
    [0, 2, 5],
    [0, 1, 2, 3, 4, 5, 6],
    [0, 1, 2, 3, 5, 6],
];

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0);

	let sum = 0;
	for (const line of lines) {
		const first = line.split('|')[0].replace(/(^\s+|\s+$)/g, '');
		const config = newFindConfig(first);

		const second = line.split('|')[1].replace(/(^\s+|\s+$)/g, '').split(' ');
		let digits = '';
		for (const seq of second) {
			digits += getDigit(seq, config);
		}

		const num = parseInt(digits, 10);
		sum += num;
	}

	return sum;
}

function getDigit(seq, m) {
	let indices = [];
	for (let i = 0; i < seq.length; i++) {
		for (let j = 0; j < m.length; j++) {
			if (m[j][0] === seq[i]) {
				indices.push(j);
			}
		}
	}

	indices.sort((a, b) => a - b);

	const matches = (idx, ma) => idx.length === ma.length && idx.filter(i => !ma.includes(i)).length === 0;
    for (let i = 0; i < patterns.length; i++) {
        if (matches(indices, patterns[i])) {
            return ""+i;
        }
    }

	throw 'invalid digit';
}

function newFindConfig(signalsStr) {
    const intersection = (chars, digit) => {
        const pattern = patterns[digit];
        const notPattern = patterns[8].filter(d => !pattern.includes(d));
        // Filter out characters not in chars for locations that are part of pattern.
        for (const d of pattern) {
            config[d] = config[d].filter(c => chars.includes(c));
        }
        // Filter out characters that are in chars for locations that are not part of pattern.
        for (const d of notPattern) {
            config[d] = config[d].filter(c => !chars.includes(c));
        }
    }

	const config = [
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
	];

    const signals = signalsStr.split(' ');
    const one = signals.filter(s => s.length === 2)[0];
    const four = signals.filter(s => s.length === 4)[0];
    const seven = signals.filter(s => s.length === 3)[0];
    intersection(one, 1);
    intersection(four, 4);
    intersection(seven, 7);
    
    const six = signals.filter(s => s.length === 6 && sub(one, s).length === 1)[0];
    intersection(six, 6);

    const two = signals.filter(s => s.length === 5 && !s.includes(config[5]))[0];
    intersection(two, 2);

    const nine = signals.filter(s => s.length === 6 && s.includes(config[2]) && s.includes(config[3]))[0];
    intersection(nine, 9);

    if (config.filter(e => e.length > 1).length > 0) {
        throw "Invalid configuration";
    }

    return config;
}

function sub(a, b) {
    return (!a.filter ? a.split('') : a).filter(c => !b.includes(c));
}

const testResult = exec(testPath);
if (testResult != 61229) {
	throw `Test failed: ${testResult}`;
}

const realResult = exec(realPath);
if (realResult != 936117) {
    throw `Real failed: ${realResult}`;
}
console.log(realResult);