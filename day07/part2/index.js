const fs = require('fs');

function exec(path) {
    const data = fs.readFileSync(path, { encoding: 'utf-8' });
    const crabs = data.split(',').map(s => parseInt(s, 10));
    const furthest = Math.max(...crabs);
    let best = 1e16;
    let bestPos = 0;
    let cur = 0;
    for (let i = 0; i <= furthest; i++) {
        for (const crab of crabs) {
            const n = Math.abs(i - crab);
            cur += n*(n + 1)/2;
        }
        if (cur < best) {
            best = cur;
            bestPos = i;
        }
        cur = 0;
    }
    return best;
}

{
    // Test
    const res = exec('../input_test.txt');
    if (res != 168) {
        throw `Test failed: ${res}`;
    }
    console.log("Test passed");
}

console.log(`Answer: ${exec('../input.txt')}`);