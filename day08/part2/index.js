const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const lines = data.split(/\r?\n/).filter(s => s.length > 0);

	let sum = 0;
	for (const line of lines) {
		const first = line.split('|')[0].replace(/(^\s+|\s+$)/g, '');
		const mapping = findMappings(first);

		const second = line.split('|')[1].replace(/(^\s+|\s+$)/g, '').split(' ');
		let digits = '';
		for (const seq of second) {
			digits += getDigit(seq, mapping);
		}

		const num = parseInt(digits, 10);
		sum += num;
	}

	return sum;
}

/*
m =
[
  [ 'd' ], [ 'g' ],
  [ 'b' ], [ 'c' ],
  [ 'a' ], [ 'e' ],
  [ 'f' ]
]
seq='abcdef'
*/
function getDigit(seq, m) {
	let indices = [];
	console.log(seq);
	for (let i = 0; i < seq.length; i++) {
		for (let j = 0; j < m.length; j++) {
			if (m[j][0] === seq[i]) {
				indices.push(j);
			}
		}
	}

	console.log(indices);

	indices.sort((a, b) => a - b);

	const matches = (idx, ma) => idx.length === ma.length && idx.filter(i => !ma.includes(i)).length === 0;
	if (matches(indices, [0, 1, 2, 4, 5, 6])) {
		return '0';
	}

	if (matches(indices, [2, 5])) {
		return '1';
	}

	if (matches(indices, [0, 2, 3, 4, 6])) {
		return '2';
	}

	if (matches(indices, [0, 2, 3, 5, 6])) {
		return '3';
	}

	if (matches(indices, [1, 2, 3, 5])) {
		return '4';
	}

	if (matches(indices, [0, 1, 3, 5, 6])) {
		return '5';
	}

	if (matches(indices, [0, 1, 3, 4, 5, 6])) {
		return '6';
	}

	if (matches(indices, [0, 2, 5])) {
		return '7';
	}

	if (matches(indices, [0, 1, 2, 3, 4, 5, 6])) {
		return '8';
	}

	if (matches(indices, [0, 1, 2, 3, 5, 6])) {
		return '9';
	}

	return 'invalid digit';
}



/*
 0000
1    2
1    2
 3333
4    5
4    5
 6666


  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
*/
function findMappings(first) {
	const uniques = { 2: '1', 4: '4', 3: '7', 7: '8' };
	const mappings = [
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
		'abcdefg'.split``,
	];
	const entries = first.split(' ');
	console.log(entries);
	for (let i = 0; i < entries.length; i++) {
		const chars = entries[i].split('');
		switch (chars.length) {
			case 2: // Digit 1
				mappings[0] = mappings[0].filter(c => !chars.includes(c));
				mappings[1] = mappings[1].filter(c => !chars.includes(c));
				mappings[2] = mappings[2].filter(c => chars.includes(c));
				mappings[3] = mappings[3].filter(c => !chars.includes(c));
				mappings[4] = mappings[4].filter(c => !chars.includes(c));
				mappings[5] = mappings[5].filter(c => chars.includes(c));
				mappings[6] = mappings[6].filter(c => !chars.includes(c));
				break;
			case 4: // Digit 4
				mappings[0] = mappings[0].filter(c => !chars.includes(c));
				mappings[1] = mappings[1].filter(c => chars.includes(c));
				mappings[2] = mappings[2].filter(c => chars.includes(c));
				mappings[3] = mappings[3].filter(c => chars.includes(c));
				mappings[4] = mappings[4].filter(c => !chars.includes(c));
				mappings[5] = mappings[5].filter(c => chars.includes(c));
				mappings[6] = mappings[6].filter(c => !chars.includes(c));
				break;
			case 3: // Digit 7
				mappings[0] = mappings[0].filter(c => chars.includes(c));
				mappings[1] = mappings[1].filter(c => !chars.includes(c));
				mappings[2] = mappings[2].filter(c => chars.includes(c));
				mappings[3] = mappings[3].filter(c => !chars.includes(c));
				mappings[4] = mappings[4].filter(c => !chars.includes(c));
				mappings[5] = mappings[5].filter(c => chars.includes(c));
				mappings[6] = mappings[6].filter(c => !chars.includes(c));
				break;
			// 8 uses all so can skip it
			default:
				continue;
		}
		//entries.splice(i, 1);
	}

	const uniqueUnion = (a, b) => (a.join`` + b.join``).split``.filter((e, i, a) => a.indexOf(e) === i);
	const inc = (chrs, chk) => chrs.filter(c => chk.includes(c)).length === chk.length;

	while (mappings.filter(m => m.length > 1).length != 0) {
		for (const entry of entries) {
			const chars = entry.split('');
			if (entry.length === 5) {
				const uu = uniqueUnion(mappings[2], mappings[5]);
				if (inc(chars, uu)) {
					// Digit 3
					mappings[0] = mappings[0].filter(c => chars.includes(c));
					mappings[1] = mappings[1].filter(c => !chars.includes(c));
					mappings[2] = mappings[2].filter(c => chars.includes(c));
					mappings[3] = mappings[3].filter(c => chars.includes(c));
					mappings[4] = mappings[4].filter(c => !chars.includes(c));
					mappings[5] = mappings[5].filter(c => chars.includes(c));
					mappings[6] = mappings[6].filter(c => chars.includes(c));
				} else if (mappings[2].length === 1) {
					if (chars.includes(mappings[2][0])) {
						// Digit 2
						mappings[0] = mappings[0].filter(c => chars.includes(c));
						mappings[1] = mappings[1].filter(c => !chars.includes(c));
						mappings[2] = mappings[2].filter(c => chars.includes(c));
						mappings[3] = mappings[3].filter(c => chars.includes(c));
						mappings[4] = mappings[4].filter(c => chars.includes(c));
						mappings[5] = mappings[5].filter(c => !chars.includes(c));
						mappings[6] = mappings[6].filter(c => chars.includes(c));
					} else {
						// Digit 5
						mappings[0] = mappings[0].filter(c => chars.includes(c));
						mappings[1] = mappings[1].filter(c => chars.includes(c));
						mappings[2] = mappings[2].filter(c => !chars.includes(c));
						mappings[3] = mappings[3].filter(c => chars.includes(c));
						mappings[4] = mappings[4].filter(c => !chars.includes(c));
						mappings[5] = mappings[5].filter(c => chars.includes(c));
						mappings[6] = mappings[6].filter(c => chars.includes(c));
					}
				}
			} else if (entry.length === 6) {
				const uu = uniqueUnion(mappings[2], mappings[5]);
				if (inc(chars, uu)) {
					if (mappings[3].length === 1) {
						if (chars.includes(mappings[3][0])) {
							// Digit 9
							mappings[0] = mappings[0].filter(c => chars.includes(c));
							mappings[1] = mappings[1].filter(c => chars.includes(c));
							mappings[2] = mappings[2].filter(c => chars.includes(c));
							mappings[3] = mappings[3].filter(c => chars.includes(c));
							mappings[4] = mappings[4].filter(c => !chars.includes(c));
							mappings[5] = mappings[5].filter(c => chars.includes(c));
							mappings[6] = mappings[6].filter(c => chars.includes(c));
						} else {
							// Digit 0
							mappings[0] = mappings[0].filter(c => chars.includes(c));
							mappings[1] = mappings[1].filter(c => chars.includes(c));
							mappings[2] = mappings[2].filter(c => chars.includes(c));
							mappings[3] = mappings[3].filter(c => !chars.includes(c));
							mappings[4] = mappings[4].filter(c => chars.includes(c));
							mappings[5] = mappings[5].filter(c => chars.includes(c));
							mappings[6] = mappings[6].filter(c => chars.includes(c));
						}
					} else if (mappings[4].length === 1) {
						if (chars.includes(mappings[4][0])) {
							// Digit 0
							mappings[0] = mappings[0].filter(c => chars.includes(c));
							mappings[1] = mappings[1].filter(c => chars.includes(c));
							mappings[2] = mappings[2].filter(c => chars.includes(c));
							mappings[3] = mappings[3].filter(c => !chars.includes(c));
							mappings[4] = mappings[4].filter(c => chars.includes(c));
							mappings[5] = mappings[5].filter(c => chars.includes(c));
							mappings[6] = mappings[6].filter(c => chars.includes(c));
						} else {
							// Digit 9
							mappings[0] = mappings[0].filter(c => chars.includes(c));
							mappings[1] = mappings[1].filter(c => chars.includes(c));
							mappings[2] = mappings[2].filter(c => chars.includes(c));
							mappings[3] = mappings[3].filter(c => chars.includes(c));
							mappings[4] = mappings[4].filter(c => !chars.includes(c));
							mappings[5] = mappings[5].filter(c => chars.includes(c));
							mappings[6] = mappings[6].filter(c => chars.includes(c));
						}
					}
				} else {
					// Digit 6
					mappings[0] = mappings[0].filter(c => chars.includes(c));
					mappings[1] = mappings[1].filter(c => chars.includes(c));
					mappings[2] = mappings[2].filter(c => !chars.includes(c));
					mappings[3] = mappings[3].filter(c => chars.includes(c));
					mappings[4] = mappings[4].filter(c => chars.includes(c));
					mappings[5] = mappings[5].filter(c => chars.includes(c));
					mappings[6] = mappings[6].filter(c => chars.includes(c));
				}
			}
		}
	}

	return mappings;
}

const testResult = exec(testPath);
if (testResult != 61229) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));
