class Randomcase {
	/**
	 * A function that transforms a normal string into Randomcase
	 *
	 * @static
	 * @param {String} input
	 * @memberof Randomcase
	 */
	static transform(input) {
		return input
			.split("")
			.map(char =>
				Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
			)
			.reduce((acc, curr) => acc += curr, "");
	}
}

/**
 * Program definition - main
 */

const input = process.argv[2];

if(!input) {
	console.error('Input has to be provided! Use "--help" for help');
} else {
	processInput(input);
}

function processInput(input) {
	switch(input) {
		case "--help":
		case "-h":
			console.log("Usage: node index.js \"<string to randomcase>\"");
			break;
		default:
			console.log(Randomcase.transform(input));
			break;
	}
}
