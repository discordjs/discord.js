const isASymbol = (char: string) => '-!$%^&*()_+|~=`{}[]:;<>?,. '.includes(char);

export function splitVarName(str: string) {
	const res: string[][] = [];
	let currGroup: string[] = [];
	let currStr = '';

	for (const char of str) {
		const currentlyInASymbolSection = isASymbol(currStr[0]!);
		const charIsASymbol = isASymbol(char);

		if (currStr.length && currentlyInASymbolSection !== charIsASymbol) {
			if (char === '.') {
				continue;
			}

			currGroup.push(currStr);
			currStr = char;

			if (!charIsASymbol) {
				res.push(currGroup);
				currGroup = [];
			}
		} else {
			currStr += char;
		}
	}

	currGroup.push(currStr);
	res.push(currGroup);

	return res;
}
