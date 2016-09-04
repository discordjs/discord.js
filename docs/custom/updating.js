const fs = require('fs');

module.exports = {
  category: 'General',
  name: 'Updating your code',
  data: fs.readFileSync('./docs/custom/documents/updating.md').toString('utf-8'),
};
