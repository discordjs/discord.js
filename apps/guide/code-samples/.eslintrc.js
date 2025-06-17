const path = require('node:path');

module.exports = {
	extends: path.join(__dirname, '..', '.eslintrc.js'),
	env: {
		node: true,
	},
};
