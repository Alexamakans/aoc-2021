const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

// Consts
const POINTS = {
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
}

const OPENERS = '([{<'.split('');
const CLOSERS = ')]}>'.split('');

// Functions
const getIndex = c => {
	let idx = OPENERS.indexOf(c);
	if (idx === -1) {
		idx = CLOSERS.indexOf(c);
	}
	return idx;
};

const isOpener = c => {
	return OPENERS.indexOf(c) !== -1;
}

const isCloser = c => {
	return CLOSERS.indexOf(c) !== -1;
}

const isValidCloser = (stack, c) => {
	if (isOpener(c)) {
		throw `Tried to validate opener as closer: ${c}`;
	}

	if (!isCloser(c)) {
		throw `Sanity check failed on: ${c}`;
	}

	const toClose = stack[stack.length - 1];
	const toCloseIdx = getIndex(toClose);
	const closerIdx = getIndex(c);

	return toCloseIdx === closerIdx;
}

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0);

	const errors = [];

	for (const line of lines) {
		const stack = [];


		for (const c of line.split('')) {
			const isOpen = isOpener(c);

			if (isOpen) {
				stack.push(c);
			} else if (isValidCloser(stack, c)) {
				stack.pop();
			} else {
				errors.push(c);
				break;
			}
		}
	}

	return errors.map(err => POINTS[err]).reduce((t, c) => t + c, 0);
}

const testResult = exec(testPath);
if (testResult != 26397) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));