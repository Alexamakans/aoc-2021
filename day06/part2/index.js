const fs = require('fs');

function exec(path, numDays=80) {
    const data = fs.readFileSync(path, { encoding: 'utf-8' });
    const fish = data.split(',').map(s => parseInt(s, 10));
    const buckets = [];

    const baseDays = 6;
    const newExtraDays = 2;
    for (let i = 0; i <= baseDays + newExtraDays; i++) {

        buckets[i] = fish.filter(days => days === i).length;
    }

    while (numDays-- > 0) {
        let store = buckets[0];
        for (let i = 0; i < buckets.length - 1; i++) {
            buckets[i] = buckets[i + 1];
        }

        buckets[baseDays] += store;
        buckets[baseDays + newExtraDays] = store;
    }


    return buckets.reduce((t, c) => t + c, 0);
}

{
    // Test
    const res = exec('../input_test.txt', 256);
    if (res !== 26984457539) {
        throw `Test failed: ${res}`;
    }
    console.log("Test passed");
}

console.log(`Answer: ${exec('../input.txt', 256)}`);