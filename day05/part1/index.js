const fs = require('fs');

const testData = fs.readFileSync('../input_test.txt', { encoding: 'utf-8' });
const testLines = testData.split(/\r?\n/);

const data = fs.readFileSync('../input.txt', { encoding: 'utf-8' });
const lines = data.split(/\r?\n/);

function exec(textLines) {
    /*
    [
        Line [ Point [ x1, y1 ], Point [ x2, y2 ] ]
    ]
    */
    let lines = textLines.map(line => line.split(' -> ').map(xy => xy.split(',').map(s => parseInt(s, 10))));
    // Filter out non-vert/horizontal lines.
    lines = lines.filter(line => line[0][0] == line[1][0] || line[0][1] == line[1][1]);
    let w = 0, h = 0;
    for (const line of lines) {
        w = Math.max(w, line[0][0], line[1][0]);
        h = Math.max(h, line[0][1], line[1][1]);
    }

    const cells = [];
    for (let x = 0; x <= w; x++) {
        cells[x] = [];
        for (let y = 0; y <= h; y++) {
            cells[x][y] = 0;
        }
    }

    for (const line of lines) {
        let [x1, y1] = line[0];
        let [x2, y2] = line[1];
        if (x1 > x2) {
            let swp = x1;
            x1 = x2;
            x2 = swp;
        }
        if (y1 > y2) {
            let swp = y1;
            y1 = y2;
            y2 = swp;
        }

        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                cells[x][y]++;
            }
        }
    }

    let count = 0;
    for (const col of cells) {
        for (const cell of col) {
            if (cell > 1) {
                count++;
            }
        }
    }

    return count;
}

const testRes = exec(testLines);
if (testRes != 5) {
    throw "Example failed: " + testRes;
} else {
    console.log('test passed');
}

console.log(exec(lines));