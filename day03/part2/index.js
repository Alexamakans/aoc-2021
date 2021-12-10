const fs = require('fs');

const data = fs.readFileSync('../input.txt', { encoding: 'utf-8' });
const lines = data.split('\n').map(s => s.replace(/[^01]/g, ''));
const tLines = transposeStrings(lines);

let co2Lines = lines.slice();
let oxyLines = lines.slice();
for (let bitPos = 0; bitPos < tLines.length; bitPos++) {
    const tCo2Lines = transposeStrings(co2Lines);
    const tOxyLines = transposeStrings(oxyLines);
    const rare = getRare(bitPos, tCo2Lines);
    const common = getCommon(bitPos, tOxyLines);
    if (co2Lines.length > 1) co2Lines = co2Lines.filter(l => l[bitPos] == rare);
    if (oxyLines.length > 1) oxyLines = oxyLines.filter(l => l[bitPos] == common);
}

const co2 = co2Lines[0];
const oxy = oxyLines[0];
const co2Decimal = parseInt(co2, 2);
const oxyDecimal = parseInt(oxy, 2);

console.log('co2 * oxy = life support');
console.log(`${co2Decimal} * ${oxyDecimal} = ${co2Decimal * oxyDecimal}`);


// Functions
function transposeStrings(mat) {
    const m = mat.slice().map(s => s.split(''));
    return m[0].map((_, c) => m.map((_, r) => m[r][c])).map(arr => arr.join(''));
}

function getCommon(i, a = tLines) {
    const num0s = (a[i].match(/0/g) || []).length;
    return num0s > a[i].length / 2 ? '0' : '1';
}

function getRare(i, a = tLines) {
    const num0s = (a[i].match(/0/g) || []).length;
    return num0s <= a[i].length / 2 ? '0' : '1';
}