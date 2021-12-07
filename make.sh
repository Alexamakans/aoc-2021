#!/usr/bin/env sh
echo -n "Enter the day (XX): "
read day
mkdir day$day
cd day$day
touch input.txt
touch input_test.txt

mkdir part2
cd part2
npm init -y
echo "const fs = require('fs');\n\nconst testPath = '../input_test.txt';\nconst realPath = '../input.txt';\n\nfunction exec(path) {\n\tconst data = fs.readFileSync(path, { encoding: 'utf-8' });\n\tconst lines = data.split(/\\\\r?\\\\n/);\n\tlet result;\n\treturn result;\n}\n\nconst testResult = exec(testPath);\nif (testResult != 7) {\n\tthrow \`Test failed: \${testResult}\`;\n}\n\nconsole.log(exec(realPath));" > index.js

mkdir ../part1
cd ../part1
npm init -y
echo "const fs = require('fs');\n\nconst testPath = '../input_test.txt';\nconst realPath = '../input.txt';\n\nfunction exec(path) {\n\tconst data = fs.readFileSync(path, { encoding: 'utf-8' });\n\tconst lines = data.split(/\\\\r?\\\\n/);\n\tlet result;\n\treturn result;\n}\n\nconst testResult = exec(testPath);\nif (testResult != 7) {\n\tthrow \`Test failed: \${testResult}\`;\n}\n\nconsole.log(exec(realPath));" > index.js


chmod +777 -R ../../day$day
