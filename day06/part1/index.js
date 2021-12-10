const fs = require('fs');

function exec(path, numDays=80) {
    const data = fs.readFileSync(path, { encoding: 'utf-8' });
    const fish = data.split(',').map(s => parseInt(s, 10));
    const baseDays = 6;
    const newExtraDays = 2;
    while (numDays-- > 0) {
        let numNew = 0;
        for (let i = 0; i < fish.length; i++) {
            fish[i]--;
            if (fish[i] == -1) {
                fish[i] = baseDays;
                numNew++;
            }
        }

        for (let i = 0; i < numNew; i++) {
            fish.push(baseDays + newExtraDays);
        }
    }

    return fish.length;
}

{
    // Test
    const res = exec('../input_test.txt', 18);
    if (res != 26) {
        throw `Test failed: ${res}`;
    }
    console.log("Test passed");
}

console.log(`Answer: ${exec('../input.txt', 80)}`);