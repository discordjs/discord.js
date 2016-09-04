const fs = require('fs');

module.exports = {
  category: 'General',
  name: 'Welcome',
  data: fs.readFileSync('./docs/custom/documents/welcome.md').toString('utf-8'),
};
