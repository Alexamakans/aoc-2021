const fs = require('fs');

const data = fs.readFileSync('../input.txt', { encoding: 'utf-8' }).replace(/(\r?\n)+$/, '');
const lines = data.split(/\r?\n/);

const draws = lines[0].split(',').map(s => parseInt(s, 10));
console.log(draws);
const boards = data.split(/\r?\n/)
    .filter((_, i) => i > 1)
    .join('\n')
    .split('\n\n')
    .map(board => board.split('\n')
        .map(s => s.replace(/^\s+/g, ''))
        .join(' ').split(/\s+/)
        .map(s => parseInt(s, 10))
    );

for (const board of boards) {
    if (board.length != 25) {
        throw "Wrong length";
    }
}

function fastCheck(b, drawn) {
    const hori = [];
    const vert = [];
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            hori.push([x, y]);
            vert.push([y, x]);
        }
    }

    return doCheck(b, drawn, hori) || doCheck(b, drawn, vert);
}

function doCheck(b, drawn, checks) {
    for (let i = 0; i < checks.length; i++) {
        if (i % 5 == 0) cnt = 0;
        const x = checks[i][0];
        const y = checks[i][1];
        const num = b[conv(x, y)];
        if (drawn.includes(num)) {
            cnt++;
        }

        if (cnt >= 5) {
            return true;
        }
    }
    return false;
}

function conv(x, y) {
    return x + y * boards[0].length;
}

let curDraw = 0;
let drawn = [];
let done = false;
let sumOfUnmatched = 0;

let remainingBoards = boards.slice();
let lastBoard = null;

while (!done && curDraw < draws.length) {
    drawn.push(draws[curDraw]);
    if (remainingBoards.length == 1) {
        lastBoard = remainingBoards[0];
    }
    remainingBoards = remainingBoards.filter(board => !fastCheck(board, drawn));
    done = remainingBoards.length == 0;
    if (!done) {
        ++curDraw;
    }
}

if (curDraw >= draws.length) {
    throw "Failed to find bingo";
}

unmatched = lastBoard.filter(d => !drawn.includes(d));
sumOfUnmatched = unmatched.reduce((p, c) => p + c, 0);

console.log(drawn);
console.log(sumOfUnmatched);
console.log(drawn[curDraw]);
console.log(`Answer: ${sumOfUnmatched * drawn[curDraw]}`);
