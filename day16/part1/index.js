const fs = require('fs');

const testPath = '../input_test.txt';
const realPath = '../input.txt';

const LITERAL_TYPE_ID = 4;

const MAP = {
	'0': '0000',
	'1': '0001',
	'2': '0010',
	'3': '0011',
	'4': '0100',
	'5': '0101',
	'6': '0110',
	'7': '0111',
	'8': '1000',
	'9': '1001',
	'A': '1010',
	'B': '1011',
	'C': '1100',
	'D': '1101',
	'E': '1110',
	'F': '1111',
};

function asInt(binaryStr) {
	return parseInt(binaryStr, 2);
}

function exec(path) {
	const data = fs.readFileSync(path, { encoding: 'utf-8' });
	const hex = data.replace(/(\r?\n|\s+)/g, '');
	let binary = hex.split('').map(a => MAP[a]).join('');

	function take(n) {
		const took = binary.substring(0, n);
		binary = binary.substring(n);
		return took;
	}

	const packets = [];
	for (let i = 0; i < binary.length; i++) {
		if (binary[i] === '0') {
			break;
		}

		function parsePacket() {
			const packet = {
				version: asInt(take(3)),
				type: asInt(take(3)),
				value: undefined,
				subPackets: [],
			};

			if (packet.type === LITERAL_TYPE_ID) {
				// Literal value
				let groupFirst = take(1);
				let binaryNum = '';
				while (groupFirst != '0') {
					binaryNum += take(4);
					groupFirst = take(1);
				}
				binaryNum += take(4);
				packet.value = asInt(binaryNum);
			} else {
				// Operator
				const lengthTypeId = take(1);
				if (lengthTypeId === '0') {
					// The next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet.
					const packetSize = asInt(take(15));
					const startLen = binary.length;
					while (startLen - binary.length < packetSize) {
						packet.subPackets.push(parsePacket());
					}
				} else {
					// The next 11 bits are a number that represents the number of sub-packets immediately contained by this packet.
					const numPackets = asInt(take(11));
					for (let i = 0; i < numPackets; i++) {
						packet.subPackets.push(parsePacket());
					}
				}
			}
			return packet;
		}

		packets.push(parsePacket());
	}

	function sumVersions(packets) {
		let sum = 0;
		for (const packet of packets) {
			sum += packet.version;
			if (packet.subPackets.length > 0) {
				sum += sumVersions(packet.subPackets);
			}
		}

		return sum;
	}

	return sumVersions(packets);
}

const testResult = exec(testPath);
if (testResult != 6) {
	throw `Test failed: ${testResult}`;
}

console.log(exec(realPath));