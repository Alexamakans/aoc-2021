const fs = require('fs');

const data = fs.readFileSync('../input.txt', { encoding: 'utf-8' });
const lines = data.split('\n').map(s => s.split('').filter(c => c === '0' || c === '1'));
const tLines = transpose(lines).map(arr => arr.join(''));

let gamma = '';
let epsilon = '';

for (const line of tLines) {
    const num0s = (line.match(/0/g) || []).length;
    if (num0s > line.length / 2) {
        gamma += '0';
        epsilon += '1';
    } else {
        gamma += '1';
        epsilon += '0';
    }
}

const gammaDecimal = parseInt(gamma, 2);
const epsilonDecimal = parseInt(epsilon, 2);

console.log('gamma * epsilon = power consumption');
console.log(`${gammaDecimal} * ${epsilonDecimal} = ${gammaDecimal * epsilonDecimal}`);

function transpose(matrix) {
    return matrix[0].map((_, c) => matrix.map((_, r) => matrix[r][c]));
}