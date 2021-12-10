const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

// Consts
const POINTS = {
	')': 1,
	']': 2,
	'}': 3,
	'>': 4,
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
	const lines = data.split(/\r?\n/).filter(s => s.length > 0).map(s => s.split(''));

	const validStacks = [];

	for (const line of lines) {
		const stack = [];
		let valid = true;
		for (const c of line) {
			const isOpen = isOpener(c);

			if (isOpen) {
				stack.push(c);
			} else if (isValidCloser(stack, c)) {
				stack.pop();
			} else {
				valid = false;
				break;
			}
		}

		if (valid) {
			validStacks.push(stack);
		}
	}

	const scores = [];
	for (const stack of validStacks) {
		let score = 0;
		while (stack.length > 0) {
			score = score * 5 + POINTS[CLOSERS[getIndex(stack.pop())]];
		}

		scores.push(score);
	}

	scores.sort((a, b) => a - b);

	return scores[Math.floor(scores.length / 2)];
}

const testResult = exec(testPath);
if (testResult != 288957) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));